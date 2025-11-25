export interface ISentence {
  time: string
  text: string
  pinyin: string
  annotation: Record<number, string>
}

export interface IBookDetail {
  key: string
  sentences: ISentence[]
}

export interface IBookEntry {
  key: string
  title: string
  author: string
  sections: string[]
  sentenceCount: number
  audioMd5: string
  audioSha256: string
  audioCount: number
  audioDuration: number
}
