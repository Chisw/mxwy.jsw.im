import type { ProgressHandler } from '../type'
import { AudioApi } from './audio.api'

const StoreName = {
  audioStore: 'audioStore',
  fontStore: 'fontStore',
} as const

type StoreName = keyof typeof StoreName

const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('mxwy_db', 1)

    request.onupgradeneeded = (event: any) => {
      const db = event.target.result
      if (!db.objectStoreNames.contains(StoreName.audioStore)) {
        db.createObjectStore(StoreName.audioStore, { keyPath: 'key' })
      }
      if (!db.objectStoreNames.contains(StoreName.fontStore)) {
        db.createObjectStore(StoreName.fontStore, { keyPath: 'key' })
      }
    }

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

const db: any = await openDB()

export class BinApi {
  static async fetchBlob(storeName: StoreName, key: string) {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite')
      const store = transaction.objectStore(storeName)

      const res = store.get(key)

      transaction.oncomplete = () => resolve(res.result)
      transaction.onerror = () => reject(transaction.error)
    })
  }

  static async cacheBlob(storeName: StoreName, key: string, blob: Blob) {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite')
      const store = transaction.objectStore(storeName)

      store.put({ key, blob })

      transaction.oncomplete = () => resolve(true)
      transaction.onerror = () => reject(transaction.error)
    })
  }

  static async clearBlob(storeName: StoreName, key: string) {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite')
      const store = transaction.objectStore(storeName)

      store.delete(key)

      transaction.oncomplete = () => resolve(true)
      transaction.onerror = () => reject(transaction.error)
    })
  }

  static async fetchAudioBlob(bookKey: string) {
    return await this.fetchBlob(StoreName.audioStore, bookKey)
  }

  static async cacheAudioBlob(bookKey: string, onProgress: ProgressHandler) {
    const url = AudioApi.getAudioUrl(bookKey)
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error('Failed to fetch audio')
    }

    const contentLength = response.headers.get('Content-Length')
    const total = contentLength ? parseInt(contentLength) : 0

    const reader = response!.body!.getReader()
    const chunks = []
    let received = 0
  
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
  
      chunks.push(value)
      received += value.length
  
      if (total > 0) {
        onProgress(received, total)
      }
    }

    const blob = new Blob(chunks, { type: 'audio/aac' })

    // const arrayBuffer = await response.arrayBuffer()
    // const blob = new Blob([arrayBuffer], { type: 'audio/aac' })

    return await this.cacheBlob(StoreName.audioStore, bookKey, blob)
  }

  static async clearAudioBlob(bookKey: string) {
    return await this.clearBlob(StoreName.audioStore, bookKey)
  }
}
