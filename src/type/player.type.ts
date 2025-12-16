import type { ISection } from './common.type'

export type ProgressHandler = (received: number, total: number) => void

export class PlayerConfig {
  bookKey = ''
  fontSize = 20
  autoScroll = true
  backgroundMusic = true
  loop = true
  volume = 1
  playbackRate = 1
  sectionRecord: Record<string, ISection> = {}

  constructor(config?: Partial<PlayerConfig>) {
    if (config) {
      const {
        bookKey,
        fontSize,
        autoScroll,
        backgroundMusic,
        loop,
        volume,
        playbackRate,
        sectionRecord,
      } = config

      this.bookKey = bookKey || ''
      this.fontSize = fontSize || 20
      this.autoScroll = autoScroll || true
      this.backgroundMusic = backgroundMusic || true
      this.loop = loop || false
      this.volume = volume || 1
      this.playbackRate = playbackRate || 1
      this.sectionRecord = sectionRecord || {}
    }
  }
}
