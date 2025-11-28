import { useEffect, useMemo } from 'react'
import { BookApi } from '../../api'
import { useRequest } from '../../hooks'
import type { IBookEntry } from '../../type'

interface BookListProps {
  onChange: (bookEntry: IBookEntry) => void
}

export function BookList(props: BookListProps) {

  const { onChange } = props

  const { request: queryBookList, response } = useRequest(BookApi.queryBookList)

  const bookList = useMemo(() => {
    return response?.books || []
  }, [response])

  useEffect(() => {
    queryBookList()
  }, [queryBookList])
  
  return (
    <>
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
        {bookList.map((entry) => {
          const { key, title, author } = entry
          return (
            <div
              key={key}
              className="w-36 h-48 bg-blue-900 cursor-pointer shadow-lg"
              onClick={() => onChange(entry)}
            >
              <div className="bg-white my-auto mt-4 px-4 py-4 [writing-mode:vertical-rl] [text-orientation:upright] outline-2 -outline-offset-4 outline-blue-900">
                <div className="text-3xl">
                  <span className="font-kai">{title}</span>
                </div>
              </div>
              <div className="mt-2 text-sm text-center text-white">{author}</div>
              </div>
          )
        })}
      </div>
    </>
  )
}