import { useEffect, useMemo } from 'react'
import { BookApi } from '../../api'
import { useRequest } from '../../hooks'
import { getFormatTime, line } from '../../utils'
import { SvgIcon } from '../SvgIcon'
import { Container } from '../layout/Container'
import { useRecoilState } from 'recoil'
import { activeBookEntryState } from '../../states'
import { groupBy } from 'lodash-es'

export function BookList() {

  const [, setActiveBookEntry] = useRecoilState(activeBookEntryState)

  const { request: queryBookList, response } = useRequest(BookApi.queryBookList)

  const bookGroupList = useMemo(() => {
    const list = response?.books || []
    return groupBy(list, 'group')
  }, [response])

  useEffect(() => {
    queryBookList()
  }, [queryBookList])
  
  return (
    <>
      <Container className="pt-3 md:pt-6 pb-16 select-none">
        {Object.entries(bookGroupList).map(([group, bookList]) => {
          return (
            <div key={group}>
              <div className="mt-4 mb-2 py-3 font-bold">
                {{ 1: '辨音识字', 2: '百家选文' }[group]}
              </div>
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-5">
                {bookList.map((entry) => {
                  const { key, title, author, background, seconds } = entry
                  return (
                    <div
                      key={key}
                      className={line(`
                        p-2 md:p-4 rounded-md
                        ${seconds ? 'cursor-pointer hover:bg-zinc-100' : 'cursor-not-allowed opacity-30'}
                      `)}
                      onClick={() => seconds && setActiveBookEntry(entry)}
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
                          {title.split('').map((c, i) => (<div key={i}>{c}</div>))}
                        </div>
                      </div>

                      <div className="mt-2 text-xs md:text-sm text-center">
                        <div className="font-bold">
                          {title}
                        </div>
                        <div className="mt-1 text-zinc-400">
                          {author}
                        </div>
                        <div className="flex justify-center items-center text-zinc-400">
                          <SvgIcon.Time size={14} />&nbsp;
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
