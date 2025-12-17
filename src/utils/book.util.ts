import type { IBookEntry, ISection, ISentence, ISentenceBase } from '../type'
import { REG_PUNCTUATION } from './constant.util'
import { getSecondsByTime } from './time.util'

export const getSection = (s: string) => {
  const [name, from, to] = s.split(/@|,/)
  return { name, from: +from, to: +to }
}

export const getDefaultSection = (bookEntry: IBookEntry) => {
  const to = bookEntry.sentences
  return { name: '全部', from: 1, to } as ISection
}

export const getSentenceList = (list: ISentenceBase[], duration: number) => {
  return list.map((s, sIndex) => {
    const nextSentence = list[sIndex + 1];
    const startTime = getSecondsByTime(s.time)
    const endTime = nextSentence ? getSecondsByTime(nextSentence.time, -0.01) : duration
    return {
      ...s,
      startTime,
      endTime,
    } as ISentence
  })
}

export const getInjectedPinyinList = (pinyin: string, text: string) => {
  const pinyinList = pinyin.split(' ')

  text
    .split('')
    .reduce((a, b, i) => {
      if (REG_PUNCTUATION.test(b)) {
        a.push(i)
      }
      return a
    }, [] as number[])
    .forEach((i) => {
      pinyinList.splice(i, 0, '')
    })

  return pinyinList
}

export const getChineseChars = (text: string) => {
  return text.split('').filter(s => !REG_PUNCTUATION.test(s))
}

export const scrollToActiveSentence = () => {
  document.querySelector('.mxwy-sentence.active')?.scrollIntoView({ block: 'center' })
}
