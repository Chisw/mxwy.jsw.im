import { SvgIcon } from '../SvgIcon'
import { Container } from './Container'

export function Header() {
  return (
    <>
      <Container
        className="border-b border-zinc-200"
        innerClassName="flex-between-center py-4"
      >
        <div className="flex items-center">
          <img src="/assets/logo.png" className="w-10 h-10" />
          <p className="ml-2 text-2xl font-bold font-song">蒙学文吟</p>
        </div>
        <div className="">
          <a
            target="_blank"
            href="https://github.com/Chisw/mxwy.jsw.im"
          >
            <SvgIcon.Github size={24} />
          </a>
        </div>
      </Container>
    </>
  )
}
