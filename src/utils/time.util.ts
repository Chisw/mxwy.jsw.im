import { DateTime, Duration } from 'luxon'
import { getRound2 } from './common.util'

export const getSecondsByTime = (time: string) => {
  const [m, s] = time.split(':').map(Number)
  return getRound2(m * 60 + s)
}

export const getFormatTime = (seconds: number) => {
  return Duration.fromMillis(seconds * 1000).toFormat('hh:mm:ss')
}

export const getFormatDateTime = (date: Date) => {
  return DateTime.fromJSDate(date).setZone('Asia/Shanghai').toFormat('yyyy-MM-dd HH:mm:ss')
}
