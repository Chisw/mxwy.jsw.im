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
          const { key, title, author, background } = entry
          return (
            <div
              key={key}
              className="relative z-0 w-32 h-44 cursor-pointer shadow-lg bg-cover bg-center"
              style={{ backgroundImage: 'url("/assets/cover-bg.jpg")' }}
              onClick={() => onChange(entry)}
            >
              <div
                className="absolute z-0 inset-0 mix-blend-multiply"
                style={{ background }}
              />
              <div className="flex flex-col justify-around items-center absolute z-10 top-6 bottom-6 left-10 right-10 py-3 bg-white outline-2 -outline-offset-4 outline-black text-2xl font-song">
                {title.split('').map((c, i) => (<div key={i}>{c}</div>))}
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}