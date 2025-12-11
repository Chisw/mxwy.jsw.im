import { PlayerConfig } from '../type'
import { MXWY_PLAYER_CONFIG_KEY } from './constant.util'

export const PlayerConfigStorage = {
  get() {
    const configValue = localStorage.getItem(MXWY_PLAYER_CONFIG_KEY)
    return new PlayerConfig(configValue && JSON.parse(configValue))
  },

  set(config: PlayerConfig) {
    localStorage.setItem(MXWY_PLAYER_CONFIG_KEY, JSON.stringify(config))
  },

  remove() {
    localStorage.removeItem(MXWY_PLAYER_CONFIG_KEY)
  },
}
