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
          <div className="ml-2">
            <div className="text-xl font-bold font-song">蒙学文吟</div>
            <div className="text-xs text-zinc-400">合抱之木，生于毫末；九层之台，起于累土</div>
          </div>
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
