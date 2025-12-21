export interface ISentenceBase {
  time: string
  text: string
  pinyin: string
  annotation?: Record<number, string>
}

export interface ISentence extends ISentenceBase {
  startTime: number
  endTime: number
}

export interface ISection {
  name: string
  from: number
  to: number
}

export class ComputedSection {
  enabled = false
  from = 0
  to = 0
  startTime = 0
  endTime = 0
  leftPercent = 0
  rightPercent = 0
}

export interface IBookEntry {
  key: string
  group: number
  title: string
  author: string
  sentences: number
  seconds: number
  size: number
  sha256sum: string
  background: string
  intro: string
  autoPlay?: boolean
}

export interface IBookDetail {
  key: string
  sections: string[]
  sentences: ISentenceBase[]
}
