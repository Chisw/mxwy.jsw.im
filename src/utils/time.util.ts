import { DateTime, Duration } from 'luxon'

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
