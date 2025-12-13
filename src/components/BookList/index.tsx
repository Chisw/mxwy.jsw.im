import { useCallback, useEffect, useMemo } from 'react'
import { BookApi } from '../../api'
import { usePlayerConfig, useRequest } from '../../hooks'
import { getFormatTime, line } from '../../utils'
import { Container } from '../layout/Container'
import { useRecoilState } from 'recoil'
import { activeBookEntryState } from '../../states'
import { groupBy } from 'lodash-es'
import { Skeleton } from 'react-vant'
import type { IBookEntry } from '../../type'

export function BookList() {

  const { playerConfig, setPlayerConfig } = usePlayerConfig()

  const [activeBookEntry, setActiveBookEntry] = useRecoilState(activeBookEntryState)

  const { request: queryBookList, response, loading } = useRequest(BookApi.queryBookList)

  const { list, groupList } = useMemo(() => {
    const list = response?.books || []
    const groupList = groupBy(list, 'group')
    return { list, groupList }
  }, [response])

  const handleBookClick = useCallback((entry: IBookEntry) => {
    if (!entry.seconds) return
    setActiveBookEntry({ ...entry, autoPlay: true })
    setPlayerConfig({ bookKey: entry.key })
  }, [setActiveBookEntry, setPlayerConfig])

  useEffect(() => {
    queryBookList()
  }, [queryBookList])

  useEffect(() => {
    if (!playerConfig.bookKey || !!activeBookEntry) return

    const entry = list.find(b => b.key === playerConfig.bookKey)

    if (entry) {
      setActiveBookEntry(entry)
    }
  }, [activeBookEntry, playerConfig.bookKey, list, setActiveBookEntry])
  
  return (
    <>
      <Container className="pt-3 md:pt-6 pb-16 select-none">
        {loading && (
          <div className="mt-8 h-72">
            <Skeleton row={4} />
          </div>
        )}

        {Object.entries(groupList).map(([group, bookList]) => {
          return (
            <div key={group}>
              <div className="mt-4 mb-2 py-3 font-bold">
                {{ 1: '辨音识字', 2: '百家选文' }[group]}
              </div>
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-5">
                {bookList.map((entry) => {
                  const { key, title, author, background, seconds } = entry
                  const titleChars = title.replace(/(（上）|（下）)/, '').split('')
                  return (
                    <div
                      key={key}
                      className={line(`
                        p-2 md:p-4 rounded-md
                        ${seconds ? 'cursor-pointer hover:bg-zinc-100' : 'cursor-not-allowed opacity-30'}
                      `)}
                      onClick={() => handleBookClick(entry)}
                    >
                      <div
                        className={line(`
                          relative z-0 mx-auto w-24 h-32 md:w-32 md:h-44 rounded-sm
                          shadow-lg bg-cover bg-center overflow-hidden  
                        `)}
                        style={{ backgroundImage: 'url("/assets/cover-bg.jpg")' }}
                      >
                        <div
                          className="absolute z-0 inset-0 mix-blend-multiply"
                          style={{ background }}
                        />
                        <div
                          className={line(`
                            flex flex-col justify-around items-center
                            absolute z-10 top-[10%] bottom-[10%] left-[28%] right-[28%]
                            pt-[2%] pb-[6%] bg-white
                            outline-2 -outline-offset-4 outline-black text-base md:text-2xl font-song  
                          `)}
                        >
                          {titleChars.map((c, i) => (<div key={i}>{c}</div>))}
                        </div>
                      </div>

                      <div className="mt-2 text-xs md:text-sm text-center">
                        <div className="font-bold">
                          {title}
                        </div>
                        <div className="mt-1 text-zinc-400">
                          {author}
                        </div>
                        <div className="text-center text-zinc-400">
                          {getFormatTime(seconds)}
                        </div>
                      </div>

                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </Container>
    </>
  )
}
