import type { IBookDetail, IBookEntry } from '../type'
import { request } from './service'

export class BookApi {
  static async queryBookList () {
    const data = await request(`/books/index.yml`)
    return data as { books: IBookEntry[] }
  }

  static async queryBookDetail (key: string) {
    const data = await request(`/books/${key}.yml`)
    return data as IBookDetail
  }
}
