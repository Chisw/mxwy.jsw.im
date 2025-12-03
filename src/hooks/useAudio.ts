import { useCallback, useEffect, useMemo, useState } from 'react'
import { getFormatTime } from '../utils'

const audioEl: HTMLAudioElement = new Audio()

export function useAudio() {

  const [url, setUrl] = useState('')
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isPlaying, setIsPlaying] = useState(false)

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
    audioEl.pause()
    audioEl.src = u
    audioEl.load()
    setUrl(u)
    setDuration(0)
    setCurrentTime(0)
  }, [url])

  const changeCurrentTime = useCallback((time: number) => {
    audioEl.currentTime = time
    setCurrentTime(time)
  }, [])

  const changeVolume = useCallback((vol: number) => {
    audioEl.volume = vol
  }, [])

  const changePlaybackRate = useCallback((rate: number) => {
    audioEl.playbackRate = rate
  }, [])

  useEffect(() => {
    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)
    const handleTimeUpdate = () => setCurrentTime(audioEl.currentTime)
    const handleLoadedMetadata = () => setDuration(audioEl.duration)
    const handleVolumeChange = () => setVolume(audioEl.volume)
    const handleEnded = () => setIsPlaying(false)

    audioEl.addEventListener('play', handlePlay)
    audioEl.addEventListener('pause', handlePause)
    audioEl.addEventListener('timeupdate', handleTimeUpdate)
    audioEl.addEventListener('loadedmetadata', handleLoadedMetadata)
    audioEl.addEventListener('volumechange', handleVolumeChange)
    audioEl.addEventListener('ended', handleEnded)
    audioEl.addEventListener('', handleEnded)

    return () => {
      audioEl.pause()
      audioEl.removeEventListener('play', handlePlay)
      audioEl.removeEventListener('pause', handlePause)
      audioEl.removeEventListener('timeupdate', handleTimeUpdate)
      audioEl.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audioEl.removeEventListener('volumechange', handleVolumeChange)
      audioEl.removeEventListener('ended', handleEnded)
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
    changePlaybackRate,
  }
}
