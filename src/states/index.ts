import { atom } from 'recoil'
import type { IBookEntry } from '../type'
import { PlayerConfig } from '../type'
import { PlayerConfigStorage } from '../utils/storage.util'

export const activeBookEntryState = atom<IBookEntry | null>({
  key: 'activeBookEntry',
  default: null,
})

export const playerConfigState = atom<PlayerConfig>({
  key: 'playerConfig',
  default: PlayerConfigStorage.get(),
})
