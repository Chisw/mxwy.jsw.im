import { DateTime, Duration } from 'luxon'

export const getInjectedPinyinList = (pinyin: string, text: string) => {
  const pinyinList = pinyin.split(' ')

  text
    .split('')
    .reduce((a, b, i) => {
      if (/(，|。|：|；|？)/.test(b)) {
        a.push(i)
      }
      return a
    }, [] as number[])
    .forEach((i) => {
      pinyinList.splice(i, 0, '')
    })

  return pinyinList
}

export const getSecondsByTime = (time: string) => {
  const [m, s] = time.split(':').map(Number)
  return m * 60 + s
}

export const getFormatTime = (seconds: number) => {
  return Duration.fromMillis(seconds * 1000).toFormat('hh:mm:ss')
}

export const getFormatDateTime = (date: Date) => {
  return DateTime.fromJSDate(date).toFormat('yyyy-MM-dd hh:mm:ss')
}

export const line = (str: string) => str
  .replace(/\n/g, ' ')
  .replace(/\s+/g, ' ')
  .trim()
