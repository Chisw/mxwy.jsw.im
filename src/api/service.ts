import { parse } from 'yaml'

const getRefreshStamp = () => Math.floor(Date.now() / 60 / 60 / 1000)

export const BASE_URL = import.meta.env.VITE_API_BASE_URL

export const request = async (path: string) => {
  const text = await fetch(`${BASE_URL}${path}?t=${getRefreshStamp()}`).then(res => res.text())
  return parse(text)
}
