import { atom } from 'recoil'
import type { IBookEntry } from '../type'

export const activeBookEntryState = atom<IBookEntry | null>({
  key: 'activeBookEntry',
  default: null,
})
