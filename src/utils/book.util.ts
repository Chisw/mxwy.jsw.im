import type { IBookEntry, ISection, ISentence, ISentenceBase } from '../type'
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
    const endTime = nextSentence ? getSecondsByTime(nextSentence.time) : duration
    return {
      ...s,
      startTime,
      endTime,
    } as ISentence
  })
}
