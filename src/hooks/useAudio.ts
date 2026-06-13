import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  BACKGROUND_MUSIC_EVENT_TRIGGER,
  BACKGROUND_MUSIC_VOL_RATIO,
  getFormatTime,
  getRound2,
  PlayerConfigStorage,
} from '../utils'
import { AudioApi } from '../api'
import { usePlayerConfig } from './usePlayerConfig'

let isAudioPlaying = false

const audioEl: HTMLAudioElement = new Audio()
const bgAudioEl: HTMLAudioElement = new Audio()
const vol = PlayerConfigStorage.get().volume

audioEl.volume = vol
bgAudioEl.volume = vol * BACKGROUND_MUSIC_VOL_RATIO
bgAudioEl.loop = true
bgAudioEl.preload = 'none'
bgAudioEl.src = AudioApi.getAudioUrl('-background')

window.addEventListener(BACKGROUND_MUSIC_EVENT_TRIGGER, (event) => {
  if ((event as CustomEvent).detail) {
    if (!isAudioPlaying) return
    bgAudioEl.play()
  } else {
    bgAudioEl.pause()
  }
})

export function useAudio() {

  const { playerConfig } = usePlayerConfig()

  const [url, setUrl] = useState('')
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isEnded, setIsEnded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const playInfo = useMemo(() => {
    return {
      percent: duration ? currentTime / duration * 100 : 0,
      durationLabel: getFormatTime(duration),
      currentTimeLabel: getFormatTime(currentTime),
    }
  }, [currentTime, duration])

  const play = useCallback(() => {
    audioEl.play()
    if (playerConfig.backgroundMusic) {
      bgAudioEl.play()
    }
  }, [playerConfig.backgroundMusic])

  const pause = useCallback(() => {
    audioEl.pause()
    bgAudioEl.pause()
  }, [])

  const toggle = useCallback(() => {
    if (isPlaying) {
      pause()
    } else {
      play()
    }
  }, [isPlaying, pause, play])

  const changeUrl = useCallback((u: string) => {
    if (u === url) return
    setUrl(u)
    setDuration(0)
    setCurrentTime(0)
    setIsLoading(true)

    audioEl.onloadeddata = () => {
      setIsLoading(false)
    }

    audioEl.pause()
    audioEl.src = u
    audioEl.load()
  }, [url])

  const changeCurrentTime = useCallback((time: number) => {
    const t = time + 0.01
    audioEl.currentTime = t
    setCurrentTime(t)
  }, [])

  const changeVolume = useCallback((vol: number) => {
    audioEl.volume = vol
    bgAudioEl.volume = vol * BACKGROUND_MUSIC_VOL_RATIO
  }, [])

  const changePlaybackRate = useCallback((rate: number) => {
    audioEl.playbackRate = rate
  }, [])

  useEffect(() => {
    const handlePlay = () => {
      isAudioPlaying = true
      setIsPlaying(true)
      setIsEnded(false)
    }

    const handlePause = () => {
      isAudioPlaying = false
      setIsPlaying(false)
    }

    const handleTimeUpdate = () => setCurrentTime(audioEl.currentTime)

    const handleLoadedMetadata = () => {
      audioEl.playbackRate = PlayerConfigStorage.get().playbackRate

      const d = getRound2(audioEl.duration)
      // console.log('audioEl.duration', d)

      setDuration(d)
    }

    const handleEnded = () => {
      isAudioPlaying = false
      setIsPlaying(false)
      setIsEnded(true)
    }

    audioEl.addEventListener('play', handlePlay)
    audioEl.addEventListener('pause', handlePause)
    audioEl.addEventListener('timeupdate', handleTimeUpdate)
    audioEl.addEventListener('loadedmetadata', handleLoadedMetadata)
    audioEl.addEventListener('ended', handleEnded)
    audioEl.addEventListener('', handleEnded)

    return () => {
      audioEl.pause()
      audioEl.removeEventListener('play', handlePlay)
      audioEl.removeEventListener('pause', handlePause)
      audioEl.removeEventListener('timeupdate', handleTimeUpdate)
      audioEl.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audioEl.removeEventListener('ended', handleEnded)
    }
  }, [])
  
  return {
    url,
    duration,
    currentTime,
    isPlaying,
    isEnded,
    isLoading,
    playInfo,
    play,
    pause,
    toggle,
    changeUrl,
    changeCurrentTime,
    changeVolume,
    changePlaybackRate,
  }
}
