import { Container } from './Container'

export function Footer() {
  return (
    <>
      <Container
        className="pb-16"
        innerClassName="flex-between-center py-4"
      >
        <div className="text-xs text-[#7d886b]">
          <div>https://mxwy.jsw.im</div>
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
