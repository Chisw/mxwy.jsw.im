import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRecoilState } from 'recoil'
import { activeBookEntryState } from '../../states'
import { useAudio, useRequest } from '../../hooks'
import { AudioApi, BookApi } from '../../api'
import { getInjectedPinyinList, getSecondsByTime, line } from '../../utils'
import { sortedIndex } from 'lodash-es'
import { SvgIcon } from '../SvgIcon'
import { VolumeSlider } from './VolumeSlider'
import { VolumeIcon } from './VolumeIcon'
import { Container } from '../layout/Container'

export function BookPlayer () {
  const audio = useAudio()
  const [activeBookEntry] = useRecoilState(activeBookEntryState)

  const [textContentVisible, setTextContentVisible] = useState(false)
  const [volumeSliderVisible, setVolumeSliderVisible] = useState(false)

  const { request: queryBookDetail, response } = useRequest(BookApi.queryBookDetail)

  const scrollRef = useRef<HTMLDivElement | null>(null)

  const {
    isPlaying,
    currentTime,
    volume,
    playInfo,
  } = useMemo(() => audio, [audio])

  const {
    sentenceList,
    timeList,
  } = useMemo(() => {
    const sentenceList = (response?.sentences || [])
    const timeList = sentenceList.map(o => getSecondsByTime(o.time))
    return {
      sentenceList,
      timeList,
    }
  }, [response])

  const activeSentenceIndex = useMemo(() => sortedIndex(timeList, currentTime) - 1, [currentTime, timeList])

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
    if (!activeBookEntry) return
    queryBookDetail(activeBookEntry.key)
    setTextContentVisible(true)
  }, [queryBookDetail, activeBookEntry])

  useEffect(() => {
    if (!activeBookEntry) return
    audio.changeUrl(AudioApi.getAudioUrl(activeBookEntry.key))
    audio.play()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeBookEntry])


  useEffect(() => {
    if (!scrollRef.current) return
    document.querySelector(`[data-index="${activeSentenceIndex}"]`)?.scrollIntoView({ block: 'center' })
  }, [activeSentenceIndex])

  if (!activeBookEntry) {
    return <></>
  }

  return (
    <>
      <div
        className={line(`
          fixed z-10 inset-0 bottom-16
        text-green-900 bg-green-100
          transition-all duration-200
          ${textContentVisible ? '' : 'translate-y-[120vh]'}  
        `)}
      >

        <div
          className={line(`
            flex-center-center absolute z-20 top-0 right-0 m-4 w-10 h-10 rounded-full
          bg-white text-green-500 cursor-pointer shadow-lg shadow-green-200
          `)}
          onClick={() => setTextContentVisible(false)}
        >
          <SvgIcon.ChevronBottom size={28} />
        </div>

        <div className="absolute z-10 inset-0 bottom-auto h-12 bg-linear-to-b from-green-100 via-green-100/90 to-transparent pointer-events-none" />
        <div className="absolute z-10 inset-0    top-auto h-12 bg-linear-to-t from-green-100 via-green-100/90 to-transparent pointer-events-none" />

        <div
          ref={scrollRef}
          data-customized-scrollbar
          className="absolute z-0 inset-0 py-20 overflow-y-auto select-none"
        >
          {sentenceList.map(({ time, text, pinyin }, sentenceIndex) => {
            const textList = text.split('')
            const pinyinList = getInjectedPinyinList(pinyin, text)
            const isActive = sentenceIndex === activeSentenceIndex

            return (
              <div
                key={time}
                data-index={sentenceIndex}
                className={line(`
                  relative z-0 mx-auto py-1 max-w-5xl
                  text-center cursor-pointer
                  hover:outline-2 hover:outline-green-500 -outline-offset-2
                  transition-all duration-100
                  group
                  ${isActive ? 'bg-green-200' : ''}  
                `)}
                onClick={() => handleSentenceClick(time)}
              >
                <div className="hidden items-center absolute z-10 top-0 left-0 -mt-6 p-1 h-6 bg-green-500 text-green-200 text-xs group-hover:flex">
                  <SvgIcon.Play size={12} />
                  <span className="ml-1">{time.slice(0, -3)}</span>
                </div>

                {textList.map((char, index) => {
                  const pinyin = pinyinList[index]
                  return (
                    <div
                      key={index}
                      className={`inline-block ${!pinyin ? 'w-3' : 'w-12'} overflow-hidden`}
                    >
                      <div className="text-sm font-py">
                        {pinyin}
                      </div>
                      <div className="text-xl font-kai">
                        {char}
                      </div>
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>

      <Container
        className="fixed z-10 right-0 bottom-0 left-0 h-16 bg-zinc-900 text-white"
        innerClassName="flex items-center h-full select-none"
      >
        <div
          className="shrink-0 flex-center-center w-8 h-8 text-white bg-green-500 rounded-full cursor-pointer"
          onClick={audio.toggle}
        >
          {isPlaying ? <SvgIcon.Pause size={20} /> : <SvgIcon.Play size={20} />}
        </div>

        {/* <div className="ml-4 w-12 h-12 rounded bg-zinc-100" /> */}

        <div className="grow ml-4">
          <div className="flex justify-between items-center flex-col md:flex-row">
            <div className="text-xs">
              <span className="cursor-pointer" onClick={() => setTextContentVisible(true)}>《{activeBookEntry.title}》{activeBookEntry.author}</span>
              <span className="ml-4 opacity-40">白云出岫</span>
            </div>
            <div className="text-xs tabular-nums">
              <span>{playInfo.currentTimeLabel}</span>
              <span className="opacity-40">/{playInfo.durationLabel}</span>
            </div>
          </div>
          <div className="mt-2">
            <div className="relative w-full h-1 bg-zinc-800 rounded-full">
              <div
                className="h-full bg-green-500 rounded-full transition-all duration-100"
                style={{ width: `${playInfo.percent}%` }}
              />
            </div>
          </div>
        </div>

        <div className="shrink-0 relative z-0 ml-4">
          <div
            className="cursor-pointer hover:text-green-500"
            onClick={() => setVolumeSliderVisible(true)}
          >
            <VolumeIcon volume={volume} size={20} />
          </div>

          <VolumeSlider
            show={volumeSliderVisible}
            volume={volume}
            right={-2}
            bottom={28}
            onClose={() => setVolumeSliderVisible(false)}
            onVolumeChange={handleVolumeChange}
          />
        </div>

        <div
          className="shrink-0 ml-4 cursor-pointer hover:text-green-500"
          onClick={() => {}}
        >
          <SvgIcon.Settings size={20} />
        </div>
      </Container>
    </>
  )
}
