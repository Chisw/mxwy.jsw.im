import { parse } from 'yaml'

export const BASE_URL = import.meta.env.VITE_API_BASE_URL

export const request = async (path: string) => {
  const text = await fetch(`${BASE_URL}${path}`).then(res => res.text())
  return parse(text)
}
