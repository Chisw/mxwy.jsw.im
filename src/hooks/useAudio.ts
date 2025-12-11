import { useCallback, useEffect, useMemo, useState } from 'react'
import { getFormatTime, getRound2, PlayerConfigStorage } from '../utils'

const audioEl: HTMLAudioElement = new Audio()

audioEl.volume = PlayerConfigStorage.get().volume

export function useAudio() {

  const [url, setUrl] = useState('')
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isEnded, setIsEnded] = useState(false)

  const playInfo = useMemo(() => {
    return {
      percent: duration ? currentTime / duration * 100 : 0,
      durationLabel: getFormatTime(duration),
      currentTimeLabel: getFormatTime(currentTime),
    }
  }, [currentTime, duration])

  const play = useCallback(() => {
    audioEl.play()
  }, [])

  const pause = useCallback(() => {
    audioEl.pause()
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
  }, [])

  const changePlaybackRate = useCallback((rate: number) => {
    audioEl.playbackRate = rate
  }, [])

  useEffect(() => {
    const handlePlay = () => {
      setIsPlaying(true)
      setIsEnded(false)
    }

    const handlePause = () => setIsPlaying(false)
    const handleTimeUpdate = () => setCurrentTime(audioEl.currentTime)

    const handleLoadedMetadata = () => {
      audioEl.playbackRate = PlayerConfigStorage.get().playbackRate

      const d = getRound2(audioEl.duration)
      // console.log('audioEl.duration', d)

      setDuration(d)
    }

    const handleEnded = () => {
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
