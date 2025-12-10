import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRecoilState } from 'recoil'
import { activeBookEntryState, playerConfigState } from '../../states'
import { useAudio, useRequest } from '../../hooks'
import { AudioApi, BookApi } from '../../api'
import { getInjectedPinyinList, getSecondsByTime, line } from '../../utils'
import { sortedIndex } from 'lodash-es'
import { SvgIcon } from '../SvgIcon'
import { VolumeSlider } from './VolumeSlider'
import { VolumeIcon } from './VolumeIcon'
import { Container } from '../layout/Container'
import Settings from './Settings'
import type { ISection, ISentenceRow } from '../../type'

export function BookPlayer () {
  const audio = useAudio()

  const [activeBookEntry] = useRecoilState(activeBookEntryState)
  const [playerConfig] = useRecoilState(playerConfigState)

  const [textContentVisible, setTextContentVisible] = useState(false)
  const [volumeSliderVisible, setVolumeSliderVisible] = useState(false)
  const [settingsVisible, setSettingsVisible] = useState(false)
  const [section, setPlayingSection] = useState<ISection>({ name: '全部', from: 1, to: activeBookEntry?.sentences || 1 })

  const { request: queryBookDetail, response, setResponse } = useRequest(BookApi.queryBookDetail)

  const scrollRef = useRef<HTMLDivElement | null>(null)

  const {
    isPlaying,
    isEnded,
    currentTime,
    volume,
    playInfo,
  } = useMemo(() => audio, [audio])

  const {
    sectionList,
    sentenceRowList,
    timeList,
  } = useMemo(() => {
    const list = (response?.sentences || [])
    const sentenceRowList: ISentenceRow[] = list.map((s, sIndex) => {
      const nextSentence = list[sIndex + 1];
      const startTime = getSecondsByTime(s.time)
      const endTime = nextSentence ? getSecondsByTime(nextSentence.time) : activeBookEntry!.seconds
      return {
        ...s,
        startTime,
        endTime,
      }
    })

    const sectionList: ISection[] = (response?.sections || []).map(s => {
      const [name, from, to] = s.split(/@|,/)
      return { name, from: +from, to: +to }
    })

    const timeList = sentenceRowList.map(s => s.startTime)

    return {
      sectionList,
      sentenceRowList,
      timeList,
    }
  }, [response, activeBookEntry])

  const activeSentenceIndex = useMemo(() => {
    return sortedIndex(timeList, +currentTime.toFixed(2)) - 1
  }, [currentTime, timeList])

  const handleSentenceClick = useCallback((time: number) => {
    audio.changeCurrentTime(time)
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
    setResponse(null)
    queryBookDetail(activeBookEntry.key)
    setTextContentVisible(true)
  }, [queryBookDetail, activeBookEntry, setResponse])

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

  useEffect(() => {
    if (isEnded && playerConfig.loop) {
      audio.changeCurrentTime(0)
      audio.play()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEnded, playerConfig.loop])

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

        {/* 关闭 */}
        <div
          className={line(`
            flex-center-center absolute z-20 top-0 right-0 m-2 w-10 h-10 rounded-full
          bg-white text-green-500 cursor-pointer shadow-lg shadow-green-200
          `)}
          onClick={() => setTextContentVisible(false)}
        >
          <SvgIcon.ChevronBottom size={28} />
        </div>

        {/* <div className="absolute z-10 inset-0 bottom-auto h-12 bg-linear-to-b from-green-100 via-green-100/90 to-transparent pointer-events-none" />
        <div className="absolute z-10 inset-0    top-auto h-12 bg-linear-to-t from-green-100 via-green-100/90 to-transparent pointer-events-none" /> */}

        {/* 文本区域 */}
        <div
          ref={scrollRef}
          data-customized-scrollbar
          className="absolute z-0 inset-0 py-10 overflow-y-auto select-none"
        >
          {sentenceRowList.map(({ time, text, pinyin, startTime }, sentenceIndex) => {
            const textList = text.split('')
            const pinyinList = getInjectedPinyinList(pinyin, text)
            const isActive = sentenceIndex === activeSentenceIndex
            const section = sectionList.find(s => s.from === sentenceIndex + 1)

            return (
              <Fragment key={time}>

                {!!section && (
                  <div className="sticky z-10 -top-10 py-2 text-center text-xs text-green-600 bg-green-100">
                    {section.name}
                  </div>
                )}

                <div
                  data-index={sentenceIndex}
                  data-tag={`${sentenceIndex + 1}@${time.slice(0, -3)}`}
                  className={line(`
                    mxwy-sentence
                    relative z-0
                    text-center cursor-pointer
                    hover:outline-2 hover:outline-green-500 -outline-offset-2
                    group
                    ${isActive ? 'bg-green-200' : ''}  
                  `)}
                  onClick={() => handleSentenceClick(startTime + 0.01)}
                >
                  {textList.map((char, charIndex) => {
                    const pinyin = pinyinList[charIndex]
                    const isPunctuation = !pinyin
                    const { fontSize } = playerConfig
                    return (
                      <div
                        key={charIndex}
                        data-pinyin={pinyin}
                        className={line(`
                          mxwy-sentence-character
                          relative inline-block overflow-hidden font-kai
                          ${isPunctuation ? 'text-left' : ''}
                        `)}
                        style={{
                          paddingTop: fontSize + fontSize * 0.4,
                          paddingBottom: fontSize * 0.1,
                          width: isPunctuation ? fontSize / 2 : fontSize * 2.2,
                          fontSize,
                        }}
                      >
                        {char}
                      </div>
                    )
                  })}
                </div>
              </Fragment>
            )
          })}
        </div>
      </div>

      {/* player */}
      <Container
        className="fixed z-10 right-0 bottom-0 left-0 h-16 bg-zinc-900 text-white"
        innerClassName="flex items-center h-full select-none"
        onClick={() => setTextContentVisible(true)}
      >
        <div
          className="shrink-0 flex-center-center w-10 h-10 text-white bg-green-500 rounded-full cursor-pointer"
          onClick={audio.toggle}
        >
          {isPlaying ? <SvgIcon.Pause size={20} /> : <SvgIcon.Play size={20} />}
        </div>

        <div className="grow ml-4">
          <div className="flex justify-between items-center flex-col md:flex-row">
            <div className="text-xs">
              <span className="cursor-pointer">
                《{activeBookEntry.title}》
              </span>
              <span className="ml-1 opacity-40">
                {activeBookEntry.author}
              </span>
            </div>
            <div className="text-xs tabular-nums">
              <span>{playInfo.currentTimeLabel}</span>
              <span className="opacity-50">/{playInfo.durationLabel}</span>
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

        {/* volume */}
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
            onClose={() => setVolumeSliderVisible(false)}
            onVolumeChange={handleVolumeChange}
          />
        </div>

        {/* settings */}
        <div
          className="shrink-0 ml-4 cursor-pointer hover:text-green-500"
          onClick={() => setSettingsVisible(true)}
        >
          <SvgIcon.Settings size={20} />
        </div>
      </Container>

      <Settings
        visible={settingsVisible}
        {...{
          section,
          sectionList,
          sentenceRowList,
        }}
        onSectionChange={setPlayingSection}
        onPlaybackRateChange={audio.changePlaybackRate}
        onClose={() => setSettingsVisible(false)}
      />
    </>
  )
}
