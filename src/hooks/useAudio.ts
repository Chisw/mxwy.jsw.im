import { useCallback, useEffect, useMemo, useState } from 'react'
import { getFormatTime } from '../utils'

const audio: HTMLAudioElement = new Audio()

export function useAudio() {

  const [url, setUrl] = useState('')
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isPlaying, setIsPlaying] = useState(false)

  const playInfo = useMemo(() => {
    return {
      percent: currentTime / duration * 100,
      durationLabel: getFormatTime(duration),
      currentTimeLabel: getFormatTime(currentTime),
    }
  }, [currentTime, duration])

  const play = useCallback(() => {
    audio.play()
  }, [])

  const pause = useCallback(() => {
    audio.pause()
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
    audio.pause()
    audio.src = u
    audio.load()
    setUrl(u)
    setDuration(0)
    setCurrentTime(0)
  }, [url])

  const changeCurrentTime = useCallback((time: number) => {
    audio.currentTime = time
    setCurrentTime(time)
  }, [])

  const changeVolume = useCallback((vol: number) => {
    audio.volume = vol
  }, [])

  useEffect(() => {
    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime)
    const handleLoadedMetadata = () => setDuration(audio.duration)
    const handleVolumeChange = () => setVolume(audio.volume)
    const handleEnded = () => setIsPlaying(false)

    audio.addEventListener('play', handlePlay)
    audio.addEventListener('pause', handlePause)
    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('volumechange', handleVolumeChange)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.pause()
      audio.removeEventListener('play', handlePlay)
      audio.removeEventListener('pause', handlePause)
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('volumechange', handleVolumeChange)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [])
  
  return {
    url,
    duration,
    currentTime,
    volume,
    isPlaying,
    playInfo,
    play,
    pause,
    toggle,
    changeUrl,
    changeCurrentTime,
    changeVolume,
  }
}
