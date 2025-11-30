import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useAudio, useRequest } from '../../hooks'
import { AudioApi, BookApi } from '../../api'
import { getInjectedPinyinList, getSecondsByTime } from '../../utils'
import { sortedIndex } from 'lodash-es'
import type { IBookEntry } from '../../type'
import { SvgIcon } from '../SvgIcon'
import { VolumeSlider } from './VolumeSlider'
import { VolumeIcon } from './VolumeIcon'

interface BookPlayerProps {
  bookEntry: IBookEntry
  onBack: () => void
}

export function BookPlayer (props: BookPlayerProps) {
  const { bookEntry, onBack } = props

  const audio = useAudio()

  const [volumeSliderShow, setVolumeSliderShow] = useState(false)

  const { request: queryBookDetail, response } = useRequest(BookApi.queryBookDetail)

  const scrollRef = useRef<HTMLDivElement | null>(null)

  const {
    isPlaying,
    currentTime,
    volume,
    playInfo,
  } = useMemo(() => audio, [audio])

  const timeList = useMemo(() => {
    return (response?.sentences || []).map(o => getSecondsByTime(o.time))
  }, [response])

  const activeSentenceIndex = useMemo(() => sortedIndex(timeList, currentTime) - 1, [currentTime, timeList])

  const handleBackClick = useCallback(() => {
    audio.pause()
    onBack()
  }, [audio, onBack])

  const handleSentenceClick = useCallback((time: string) => {
    audio.changeCurrentTime(getSecondsByTime(time))
    audio.play()
  }, [audio])

  const handleVolumeChange = useCallback((vol: number, offset?: number) => {
    let targetVolume: number = 0
    if (offset) {
      // targetVolume = userConfig.musicPlayerVolume + offset
    } else {
      targetVolume = vol
    }
    // const musicPlayerVolume = +Math.max(Math.min(targetVolume, 1), 0).toFixed(2)
    // setUserConfig({ ...userConfig, musicPlayerVolume })

    audio.changeVolume(targetVolume)
  }, [audio])

  useEffect(() => {
    queryBookDetail(bookEntry.key)
  }, [queryBookDetail, bookEntry])

  useEffect(() => {
    audio.changeUrl(AudioApi.getAudioUrl(bookEntry.key))
    audio.play()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookEntry])


  // useEffect(() => {
  //   if (!scrollRef.current) return
  //   // scrollRef.current.scrollTo({ top: scrollRef.current.scrollTop + 70, behavior: 'smooth' })
  // }, [activeSentenceIndex])

  return (
    <>
      <div
        className="flex-center-center fixed z-10 top-0 left-0 m-4 w-12 h-12 rounded-full bg-white text-green-500 cursor-pointer shadow-lg"
        onClick={handleBackClick}
      >
        <SvgIcon.ChevronLeft size={24} />
      </div>

      <div
        ref={scrollRef}
        className="fixed z-0 inset-0 h-screen text-green-900 bg-green-100 overflow-y-auto"
      >
        <div className="fixed z-10 top-0 right-0 left-0 h-24 bg-linear-to-b from-green-100 via-green-100 to-transparent pointer-events-none"></div>
        <div className="h-[20vh]"></div>
        {response?.sentences.map(({ time, text, pinyin }, sentenceIndex) => {
          const textList = text.split('')
          const pinyinList = getInjectedPinyinList(pinyin, text)
          const isActive = sentenceIndex === activeSentenceIndex

          return (
            <div
              key={time}
              data-index={sentenceIndex}
              className={`
                relative z-0 py-1
                text-center cursor-pointer
                hover:outline-2 hover:outline-green-500 -outline-offset-2
                transition-all duration-100
                group
                ${isActive ? 'bg-green-200' : ''}  
              `}
              onClick={() => handleSentenceClick(time)}
            >
              <div className="hidden items-center absolute z-10 top-0 left-0 -mt-6 p-1 h-6 bg-green-500 text-green-200 text-xs group-hover:flex">
                <SvgIcon.Play size={12} />
                <span className="ml-1">{time}</span>
              </div>
              <div>
                {pinyinList.map((py, index) => {
                  return (
                    <span
                      key={index}
                      className="inline-block w-12 font-thin font-py"
                    >
                      {py}
                    </span>
                  )
                })}
              </div>
              <div className="font-kai">
                {textList.map((char, index) => {
                  return (
                    <span
                      key={index}
                      className="inline-block w-12 text-xl"
                    >
                      {char}
                    </span>
                  )
                })}
              </div>
            </div>
          )
        })}
        <div className="h-[20vh]"></div>
        <div className="fixed z-10 bottom-0 right-0 left-0 h-32 bg-linear-to-t from-green-100 via-green-100 to-transparent pointer-events-none"></div>
      </div>

      <div className="fixed z-0 right-0 bottom-0 left-0 px-4 md:px-0 h-16 bg-white">
        <div className="flex items-center mx-auto max-w-6xl h-full">
          <div
            className="shrink-0 flex-center-center w-8 h-8 text-white bg-green-500 rounded-full cursor-pointer"
            onClick={audio.toggle}
          >
            {isPlaying ? <SvgIcon.Pause size={20} /> : <SvgIcon.Play size={20} />}
          </div>

          {/* <div className="ml-4 w-12 h-12 rounded bg-zinc-100"></div> */}

          <div className="grow ml-4">
            <div className="flex justify-between items-center">
              <div className="text-xs">
                <span>《{bookEntry.title}》{bookEntry.author}</span>
                <span className="ml-4 opacity-40">白云出岫</span>
              </div>
              <div className="text-xs tabular-nums">
                <span>{playInfo.currentTimeLabel}</span>
                <span className="opacity-40">/{playInfo.durationLabel}</span>
              </div>
            </div>
            <div className="mt-2">
              <div className="relative w-full h-1 bg-zinc-100 rounded-full">
                <div
                  className="h-full bg-green-700 rounded-full transition-all duration-100"
                  style={{ width: `${playInfo.percent}%` }}
                />
              </div>
            </div>
          </div>

          <div className="shrink-0 relative z-0 ml-4">
            <div
              className="cursor-pointer hover:text-green-500"
              onClick={() => setVolumeSliderShow(true)}
            >
              <VolumeIcon volume={volume} size={20} />
            </div>

            <VolumeSlider
              show={volumeSliderShow}
              volume={volume}
              right={-2}
              bottom={28}
              onClose={() => setVolumeSliderShow(false)}
              onVolumeChange={handleVolumeChange}
            />
          </div>

          <div
            className="shrink-0 ml-4 cursor-pointer hover:text-green-500"
            onClick={() => {}}
          >
            <SvgIcon.Settings size={20} />
          </div>
        </div>
      </div>
    </>
  )
}
