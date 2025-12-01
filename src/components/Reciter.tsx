import { Container } from './layout/Container'
import { SvgIcon } from './SvgIcon'

export function Reciter() {
  return (
    <Container className="mt-6 md:mt-12">
      <div className="flex items-center px-4 py-3 md:px-8 md:py-6 bg-zinc-100 rounded-2xl">
        <div className="shrink-0 w-20 md:w-24 h-20 md:h-24 rounded-full bg-zinc-100 overflow-hidden">
          <img src="https://imagev2.xmcdn.com/group88/M06/5B/F1/wKg5CV99YqWynuPOAABxuU9Rhow323.jpg!strip=1&quality=10&magick=webp&op_type=5&upload_type=cover&name=web_large&device_type=ios" />
        </div>
        <div className="ml-4">
          <div className="text-xs md:text-sm text-zinc-400">
            朗诵者：
          </div>
          <div className="flex items-center mt-1">
            <span className="text-lg md:text-2xl font-bold">白云出岫</span>
            <a
              target="_blank"
              href="https://www.ximalaya.com/zhubo/4228109"
              title="喜马拉雅"
              className="ml-3 text-sm text-zinc-400 hover:text-zinc-500"
            >
              <SvgIcon.Ximalaya size={18} />
            </a>
            <a
              target="_blank"
              href="https://weibo.com/u/1772532272"
              title="新浪微博"
              className="ml-3 text-sm text-zinc-400 hover:text-zinc-500"
            >
              <SvgIcon.Weibo size={20} />
            </a>
          </div>
          <div className="mt-2 text-xs md:text-sm text-zinc-400">
            北京邮电大学人文学院教师，制作古籍原文朗读近 5000 小时，计划到 2040 年完成 24 史全文朗读
          </div>
        </div>
      </div>
    </Container>
  )
}
