import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRecoilState } from 'recoil'
import { activeBookEntryState } from '../../states'
import { useAudio, useHotKey, usePlayerConfig, useRequest } from '../../hooks'
import { AudioApi, BookApi } from '../../api'
import { getRound2, getSection, getSentenceList, line } from '../../utils'
import { sortedIndex } from 'lodash-es'
import { SvgIcon } from '../SvgIcon'
import { Container } from '../layout/Container'
import SettingsDrawer from './SettingsDrawer'
import type { ISection } from '../../type'
import { VolumeIcon, VolumeSlider } from './VolumeControl'
import Caption from './Caption'

export function BookPlayer () {
  const audio = useAudio()
  const { playerConfig, memoSection, setPlayerConfig } = usePlayerConfig()

  const [activeBookEntry] = useRecoilState(activeBookEntryState)

  const [captionVisible, setCaptionVisible] = useState(false)
  const [volumeSliderVisible, setVolumeSliderVisible] = useState(false)
  const [settingsVisible, setSettingsVisible] = useState(false)

  const { request: queryBookDetail, response, setResponse } = useRequest(BookApi.queryBookDetail)

  const {
    sectionList,
    sentenceList,
    timeList,
  } = useMemo(() => {
    const list = response?.sentences || []
    const sentenceList = getSentenceList(list, activeBookEntry?.seconds || 0)
    const sectionList: ISection[] = (response?.sections || []).map(getSection)
    const timeList = sentenceList.map(s => s.startTime)

    return {
      sectionList,
      sentenceList,
      timeList,
    }
  }, [response, activeBookEntry])

  const activeSentenceIndex = useMemo(() => {
    return sortedIndex(timeList, getRound2(audio.currentTime)) - 1
  }, [audio.currentTime, timeList])

  const computedSection = useMemo(() => {
    const computedSection = {
      enabled: false,
      startTime: 0,
      endTime: 0,
      leftPercent: 0,
      rightPercent: 0,
    }
    if (memoSection && activeBookEntry && sentenceList.length && audio.duration) {
      const { from, to } = memoSection
      const { sentences } = activeBookEntry

      if (from > 1 || to < sentences) {
        const start = sentenceList[from - 1].startTime
        const end = sentenceList[to - 1].endTime
        computedSection.enabled = true
        computedSection.startTime = start
        computedSection.endTime = end
        computedSection.leftPercent = start / audio.duration * 100
        computedSection.rightPercent = 100 - end / audio.duration * 100
      }
    }
    return computedSection
  }, [memoSection, activeBookEntry, sentenceList, audio.duration])

  const handleToggleClick = useCallback(() => {
    if (!audio.isPlaying) {
      setCaptionVisible(true)
    }
    audio.toggle()
  }, [audio])

  const handleVolumeChange = useCallback((offset: number) => {
    const min = 0
    const max = 1
    const volume = getRound2(Math.min(Math.max(playerConfig.volume + offset, min), max))
    audio.changeVolume(volume)
    setPlayerConfig({ volume })
  }, [audio, playerConfig.volume, setPlayerConfig])

  const handleSentenceChange = useCallback((offset: number) => {
    const min = 0
    const max = sentenceList.length - 1
    const targetIndex = Math.min(Math.max(activeSentenceIndex + offset, min), max)
    const { startTime } = sentenceList[targetIndex]
    audio.changeCurrentTime(startTime)
  }, [activeSentenceIndex, audio, sentenceList])

  useHotKey({
    binding: !!activeBookEntry,
    fnMap: {
      'ArrowUp, ArrowUp': () => handleVolumeChange(0.05),
      'ArrowDown, ArrowDown': () => handleVolumeChange(-0.05),
      'ArrowLeft, ArrowLeft': () => handleSentenceChange(-1),
      'ArrowRight, ArrowRight': () => handleSentenceChange(1),
      'Backspace, Backspace': () => handleSentenceChange(0),
      'Enter, Enter': () => setCaptionVisible(true),
      'Escape, Escape': () => {
        if (settingsVisible) {
          setSettingsVisible(false)
          return
        }
        setCaptionVisible(false)
      },
      'Space, Space': audio.toggle,
    },
  })

  useEffect(() => {
    if (!activeBookEntry) return
    setResponse(null)
    queryBookDetail(activeBookEntry.key)
    if (activeBookEntry.autoPlay) {
      setCaptionVisible(true)
    }
  }, [queryBookDetail, activeBookEntry, setResponse])

  useEffect(() => {
    if (!activeBookEntry) return
    audio.changeUrl(AudioApi.getAudioUrl(activeBookEntry.key))
    if (activeBookEntry.autoPlay) {
      audio.play()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeBookEntry])

  useEffect(() => {
    if (computedSection.enabled) {
      const { startTime, endTime } = computedSection

      if (audio.currentTime < startTime) {
        audio.changeCurrentTime(startTime)
      }

      if (audio.currentTime >= endTime) {
        if (playerConfig.loop) {
          audio.changeCurrentTime(startTime)
        } else {
          audio.pause()
        }
      }
    }
    if (audio.isEnded && playerConfig.loop) {
      audio.changeCurrentTime(0)
      audio.play()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audio.isEnded, audio.currentTime, playerConfig.loop, computedSection])

  useEffect(() => {
    let timer = 0
    timer = setTimeout(() => {
      setVolumeSliderVisible(false)
    }, 2000)
    return () => clearTimeout(timer)
  }, [playerConfig.volume])

  return (
    <>
      {/* 字幕 */}
      <Caption
        audio={audio}
        visible={captionVisible}
        sectionList={sectionList}
        sentenceList={sentenceList}
        activeSentenceIndex={activeSentenceIndex}
      />

      {/* controls */}
      <Container
        className={line(`
          fixed z-10 right-0 bottom-0 left-0 h-16
          bg-zinc-900 text-white
          transition-transform duration-200
          ${activeBookEntry ? '' : 'translate-y-full'}
        `)}
        innerClassName="flex items-center h-full select-none"
      >
        {/* button */}
        <div
          className="shrink-0 flex-center-center w-10 h-10 text-white bg-green-500 rounded-full cursor-pointer"
          onClick={handleToggleClick}
        >
          {audio.isPlaying ? <SvgIcon.Pause size={24} /> : <SvgIcon.Play size={24} />}
        </div>

        {/* progress */}
        <div className="grow ml-4">
          <div className="flex justify-between items-center flex-col md:flex-row">
            <div className="text-xs">
              <span>
                {activeBookEntry?.title}
              </span>
              <span className="ml-1 opacity-40">
                {activeBookEntry?.author}
              </span>
            </div>
            <div className="mt-0.5 md:mt-0 text-xs tabular-nums">
              <span>{audio.playInfo.currentTimeLabel}</span>
              <span className="opacity-50">/{audio.playInfo.durationLabel}</span>
            </div>
          </div>
          <div className="mt-2">
            <div className="relative w-full h-1 bg-zinc-700">
              <div
                className="h-full bg-green-500"
                style={{ width: `${audio.playInfo.percent}%` }}
              />
              {computedSection.enabled && (
                <div
                  className="absolute z-0 -top-0.5 h-2 border-l border-r border-green-200"
                  style={{
                    left: `${computedSection.leftPercent}%`,
                    right: `${computedSection.rightPercent}%`,
                  }}
                />
              )}
            </div>
          </div>
        </div>

        {/* volume */}
        <div className="shrink-0 relative z-0 ml-4 p-1">
          <div
            className="relative z-0 cursor-pointer hover:text-green-500"
            onClick={() => setVolumeSliderVisible(true)}
          >
            <VolumeIcon
              size={20}
              volume={playerConfig.volume}
             />

            <div
              className={line(`
                absolute z-10 -right-2 -bottom-1.5 p-0.5
                bg-zinc-900 rounded-full text-[8px]
              `)}
            >
              {(playerConfig.volume * 100).toFixed(0)}
            </div>
          </div>

          <VolumeSlider
            visible={volumeSliderVisible}
            onVolumeChange={audio.changeVolume}
            onClose={() => setVolumeSliderVisible(false)}
          />
        </div>

        {/* settings */}
        <div
          className="shrink-0 ml-2 p-1 cursor-pointer hover:text-green-500"
          onClick={() => setSettingsVisible(true)}
        >
          <SvgIcon.Settings size={20} />
        </div>

        {/* toggle */}
        <div
          className={line(`
            relative z-0
            shrink-0 ml-2 p-1 cursor-pointer hover:text-green-500
          `)}
          onClick={() => setCaptionVisible(!captionVisible)}
        >
          <SvgIcon.Sentences size={20} />
          <div
            className={line(`
              absolute z-10 right-0 bottom-0 bg-zinc-900 rounded-full
              transition-transform duration-200
              ${captionVisible ? '' : 'rotate-180'}
            `)}
          >
            <SvgIcon.ChevronBottom size={14} />
          </div>
        </div>
      </Container>

      {!!activeBookEntry && (
        <SettingsDrawer
          key={activeBookEntry.key}
          visible={settingsVisible}
          bookEntry={activeBookEntry}
          sectionList={sectionList}
          sentenceList={sentenceList}
          onPlaybackRateChange={audio.changePlaybackRate}
          onClose={() => setSettingsVisible(false)}
        />
      )}
    </>
  )
}
