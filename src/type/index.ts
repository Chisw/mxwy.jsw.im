export interface ISentence {
  time: string
  text: string
  pinyin: string
  annotation: Record<number, string>
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
