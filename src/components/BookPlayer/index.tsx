import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRequest } from '../../hooks'
import { AudioApi, BookApi } from '../../api'
import { getInjectedPinyinList, getSecondsByTime } from '../../utils'
import { sortedIndex } from 'lodash-es'

interface BookPlayerProps {
  bookKey: string
}

export function BookPlayer (props: BookPlayerProps) {
  const { bookKey } = props

  const [isPlaying, setIsPlaying] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)

  const { request: queryBookDetail, response } = useRequest(BookApi.queryBookDetail)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const scrollRef = useRef<HTMLDivElement | null>(null)

  const timeList = useMemo(() => {
    return (response?.sentences || []).map(o => getSecondsByTime(o.time))
  }, [response])

  const handleSentenceClick = useCallback((time: string, index: number) => {
    setActiveIndex(index)
    if (!audioRef.current) return
    audioRef.current.currentTime = getSecondsByTime(time);
    audioRef.current.play()
  }, [])

  useEffect(() => {
    queryBookDetail(bookKey)
    if (audioRef.current) {
      audioRef.current.src = AudioApi.getAudioUrl(bookKey)
      setTimeout(() => {
        audioRef.current!.play()
        setIsPlaying(true)
      }, 10)
    }
  }, [queryBookDetail, bookKey])

  useEffect(() => {
    let timer: any
    const el = audioRef.current
    if (isPlaying) {
      timer = setInterval(() => {
        if (!el) return
        const { currentTime } = el
        // const currentTimeLabel = Duration.fromMillis((currentTime || 0) * 1000).toFormat(format)
        // const durationLabel = Duration.fromMillis((duration || 0) * 1000).toFormat(format)
        // const playPercent = currentTime / duration * 100
        // setPlayInfo({ currentTimeLabel, durationLabel, playPercent })

        const index = sortedIndex(timeList, currentTime) - 1
        // document.querySelector(`[data-index="${index}"]`)?.scrollIntoView({ block: 'center' })
        setActiveIndex(index)
      }, 200)
    } else {
      clearInterval(timer)
    }
    return () => clearInterval(timer)
  }, [isPlaying, timeList])


  useEffect(() => {
    if (!scrollRef.current) return
    // scrollRef.current.scrollTo({ top: scrollRef.current.scrollTop + 70, behavior: 'smooth' })
  }, [activeIndex])

  return (
    <>
      <audio ref={audioRef} controls className="fixed top-0"></audio>

      <div
        ref={scrollRef}
        className="fixed z-0 inset-0 h-screen text-green-900 bg-green-100 overflow-y-auto"
      >
        <div className="fixed z-10 top-0 right-0 left-0 h-24 bg-linear-to-b from-green-100 via-green-100 to-transparent pointer-events-none"></div>
        <div className="h-[20vh]"></div>
        {response?.sentences.map(({ time, text, pinyin }, index) => {
          const textList = text.split('')
          const pinyinList = getInjectedPinyinList(pinyin, text)

          return (
            <div
              key={time}
              data-index={index}
              className={`
                relative z-0 py-1
                text-center cursor-pointer
                hover:outline-2 hover:outline-green-500 -outline-offset-2
                transition-all duration-100
                group
                ${index === activeIndex ? 'bg-green-200' : ''}  
              `}
              onClick={() => handleSentenceClick(time, index)}
            >
              <div className="hidden absolute z-10 top-0 left-0 -mt-6 p-1 h-6 bg-green-500 text-green-200 text-xs group-hover:block">
                {time}
              </div>
              <div>
                {pinyinList.map((py, index) => {
                  return (
                    <span
                      key={index}
                      className="inline-block w-14 text-lg font-thin"
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
                      className="inline-block w-14 text-3xl"
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
        <div className="fixed z-10 bottom-0 right-0 left-0 h-24 bg-linear-to-t from-green-100 via-green-100 to-transparent pointer-events-none"></div>
      </div>

    </>
  )
}
