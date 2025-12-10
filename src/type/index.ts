export interface ISentence {
  time: string
  text: string
  pinyin: string
  annotation: Record<number, string>
}

export interface ISentenceRow extends ISentence {
  startTime: number
  endTime: number
}

export interface ISection {
  name: string
  from: number
  to: number
}

export interface IBookDetail {
  key: string
  sections: string[]
  sentences: ISentence[]
}

export interface IBookEntry {
  key: string
  group: number
  title: string
  author: string
  sentences: number
  seconds: number
  sha256sum: string
  background: string
  intro: string
}

export interface IPlayerConfig {
  fontSize: number
  loop: boolean
  playbackRate: number
}

export type ProgressHandler = (received: number, total: number) => void
