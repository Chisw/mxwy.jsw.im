import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import { getChineseChars, getInjectedPinyinList, line } from '../../utils'
import { usePlayerConfig } from '../../hooks'
import type { ISection, ISentence } from '../../type'

const tabList = [
  { key: 'annotation', name: '注解' },
  { key: 'baidu', name: '百度汉语' },
  { key: 'mengdian', name: '萌典' },
  { key: 'ziyuan', name: '字源' },
  { key: 'other', name: '其它' },
]

interface CaptionProps {
  audio: {
    isPlaying: boolean
    changeCurrentTime: (t: number) => void
  }
  visible: boolean
  sectionList: ISection[]
  sentenceList: ISentence[]
  activeSentenceIndex: number
}

export default function Caption(props: CaptionProps) {

  const {
    audio,
    visible,
    sectionList,
    sentenceList,
    activeSentenceIndex,
  } = props

  const { playerConfig} = usePlayerConfig()

  const [activeTab, setActiveTab] = useState('annotation')

  const activeSentence = useMemo(() => {
    return sentenceList[activeSentenceIndex] as ISentence | undefined
  }, [sentenceList, activeSentenceIndex])

  const scrollRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!scrollRef.current || !playerConfig.autoScroll) return
    document.querySelector(`[data-index="${activeSentenceIndex}"]`)?.scrollIntoView({ block: 'center' })
  }, [activeSentenceIndex, playerConfig.autoScroll])

  return (
    <div
      className={line(`
        fixed z-10 inset-0 bottom-16
        text-green-900 bg-green-100
        transition-all duration-200
        ${visible ? '' : 'translate-y-[120vh]'}  
      `)}
    >
      <div
        ref={scrollRef}
        data-customized-scrollbar
        className={line(`
          mxwy-caption
          absolute z-0 inset-0 pt-10 pb-40 overflow-y-auto select-none
          ${audio.isPlaying ? 'is-playing' : ''}
        `)}
      >
        {/* 句 */}
        {sentenceList.map(({ time, text, pinyin, startTime, annotation }, sentenceIndex) => {
          const { fontSize } = playerConfig
          const textList = text.split('')
          const pinyinList = getInjectedPinyinList(pinyin, text)
          const isActive = sentenceIndex === activeSentenceIndex
          const section = sectionList.find(s => s.from === sentenceIndex + 1)
          const tags = Object.keys(annotation || {}).map(Number)

          let tagCount = 0

          return (
            <Fragment key={time}>

              {/* 区间 */}
              {!!section && (
                <div
                  className="sticky z-20 -top-10 py-3 text-center text-green-600 bg-green-100"
                  style={{ fontSize: fontSize * 0.6 }}
                >
                  {section.name}
                </div>
              )}

              {/* 行 */}
              <div
                data-index={sentenceIndex}
                data-tag={`${sentenceIndex + 1}@${time.slice(0, -3)}`}
                className={line(`
                  mxwy-sentence
                  relative z-0 text-center cursor-pointer
                  hover:outline-2 hover:outline-green-500 -outline-offset-2
                  ${isActive ? 'active bg-green-200' : ''}  
                `)}
                onClick={() => audio.changeCurrentTime(startTime)}
              >
                {/* 字 */}
                {textList.map((char, charIndex) => {
                  const pinyin = pinyinList[charIndex]
                  const isPunctuation = !pinyin
                  const hasAnnotation = tags.includes(charIndex + 1)

                  if (hasAnnotation) {
                    tagCount++
                  }

                  return (
                    <div
                      key={charIndex}
                      data-pinyin={pinyin}
                      data-annotation={hasAnnotation ? `[${tagCount}]` : ''}
                      className={line(`
                        mxwy-character
                        relative z-0 inline-block overflow-hidden font-kai
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

      {/* 更多 */}
      {!!activeSentence && (
        <div
          data-customized-scrollbar
          className={line(`
            flex flex-col
            absolute z-10 bottom-2 left-1/2
            w-[96vw] max-w-xl max-h-40 -translate-x-1/2 rounded-lg overflow-hidden
            border-2 border-green-600
            bg-green-200 text-sm
            transition-all duration-300
            ${audio.isPlaying ? 'translate-y-48' : ''}
          `)}
        >
          <div className="shrink-0 flex justify-start items-center border-b border-green-600">
            {tabList.map(({ key, name }) => {
              const isActive = key === activeTab
              return (
                <div
                  key={key}
                  className={line(`
                    px-3 py-1 border-r text-base border-green-600 cursor-pointer
                    ${isActive ? 'text-white bg-green-600' : ''}
                  `)}
                  onClick={() => setActiveTab(key)}
                >
                  {name}
                </div>
              )
            })}
          </div>
          <div
            data-customized-scrollbar
            className="grow px-3 py-2 w-full min-h-24 overflow-y-auto"
          >
            {activeTab === 'annotation' && (
              <div className="leading-5">
                {activeSentence.annotation ? (
                  Object.entries(activeSentence.annotation).map(([, text ], index) => {
                    return (
                      <p
                        key={index}
                        className="mb-1"
                      >
                        <span className="font-kai">[{index + 1}]</span> {text}
                      </p>
                    )
                  })
                ) : (
                  <p>暂无</p>
                )}
              </div>
            )}
            {['baidu', 'mengdian', 'ziyuan'].includes(activeTab)  && (
              <div className="flex flex-wrap text-3xl font-kai underline decoration-1 underline-offset-4">
                {[...new Set(getChineseChars(activeSentence.text))].map((c, i) => (
                  <div
                    key={i}
                    className="px-2 py-1 cursor-pointer hover:bg-green-300 rounded"
                    onClick={() => {
                      const prefix = {
                          baidu: 'https://hanyu.baidu.com/hanyu-page/zici/s?wd=',
                          mengdian: 'https://www.moedict.tw/',
                          ziyuan: 'https://hanziyuan.net/#',
                        }[activeTab]

                      window.open(`${prefix}${c}`)
                    }}
                  >
                    {c}
                  </div>
                ))}
              </div>
            )}
            {activeTab === 'other' && (
              <div className="underline decoration-1 underline-offset-4 text-xs">
                <a className="mr-2" target="_blank" href={`https://www.baidu.com/s?wd=${activeSentence.text}`}>百度一下</a>
                <a className="mr-2" target="_blank" href={`https://www.google.com/search?q=${activeSentence.text}`}>Google</a>
                <a className="mr-2" target="_blank" href={`https://github.com/Chisw/mxwy.jsw.im/issues/new`}>纠错</a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
