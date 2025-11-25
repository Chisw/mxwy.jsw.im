import { useCallback, useEffect, useMemo } from 'react'
import { BookApi } from '../../api'
import { useRequest } from '../../hooks'

interface BookListProps {
  onChange: (key: string) => void
}

export function BookList(props: BookListProps) {

  const { onChange } = props

  const { request: queryBookList, response } = useRequest(BookApi.queryBookList)

  const bookList = useMemo(() => {
    return response?.books || []
  }, [response])

  const handleBookClick = useCallback((key: string) => {
    onChange(key)
  }, [onChange])

  useEffect(() => {
    queryBookList()
  }, [queryBookList])
  
  return (
    <>
      <div className="grid grid-cols-8 gap-3">
        {bookList.map(({ key, title, author }) => {
          return (
            <div
              key={key}
              className="w-32 h-48 bg-blue-900 text-white text-center cursor-pointer"
              onClick={() => handleBookClick(key)}
            >
              <div className="text-lg">{title}</div>
              <div className="text-xs">{author}</div>
            </div>
          )
        })}
      </div>
    </>
  )
}