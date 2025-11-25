import { BASE_URL } from './service'

export class AudioApi {
  static getAudioUrl(key: string) {
    return `${BASE_URL}/audios/${key}.m4a`
  }
}
