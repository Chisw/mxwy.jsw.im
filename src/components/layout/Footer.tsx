import { Container } from './Container'

export function Footer() {
  return (
    <>
      <Container
        className="pb-16 bg-zinc-100"
        innerClassName="flex-between-center py-4"
      >
        <div className="text-xs text-zinc-400">
          <div>mxwy.jsw.im</div>
          <div className="mt-1">更新于 {__BUILD_TIME__}</div>
        </div>
        <a
          target="_blank"
          href="https://www.netlify.com"
        >
          <img src="/assets/netlify-light.svg" className="h-8" />
        </a> 
      </Container>
    </>
  )
}
