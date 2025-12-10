import { atom } from 'recoil'
import type { IBookEntry, IPlayerConfig } from '../type'

export const activeBookEntryState = atom<IBookEntry | null>({
  key: 'activeBookEntry',
  default: null,
})

export const playerConfigState = atom<IPlayerConfig>({
  key: 'playerConfig',
  default: {
    fontSize: 20,
    loop: false,
    playbackRate: 1,
  },
})
