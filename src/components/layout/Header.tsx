import { useState } from 'react'
import { SvgIcon } from '../SvgIcon'
import { Container } from './Container'
import { Dialog } from 'react-vant'

const list = [
  { name: '蒙求', href: 'https://www.ximalaya.com/sound/8671778' },
  { name: '千家诗', href: 'https://www.ximalaya.com/album/220988' },
  { name: '小儿语', href: 'https://www.ximalaya.com/sound/171004430' },
  { name: '菜根谭', href: 'https://www.ximalaya.com/sound/6533945' },
  { name: '格言联璧', href: 'https://www.ximalaya.com/sound/7880827' },
  { name: '龙文鞭影', href: 'https://www.ximalaya.com/sound/19790768' },
  { name: '幼学琼林', href: 'https://www.ximalaya.com/sound/7464323' },
  { name: '围炉夜话', href: 'https://www.ximalaya.com/sound/1460802' },
  { name: '小窗幽记', href: 'https://www.ximalaya.com/sound/3549146' },
]

export function Header() {
  const [aboutVisible, setAboutVisible] = useState(false)

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
        <div
          className="text-zinc-300 cursor-pointer"
          onClick={() => setAboutVisible(true)}
        >
          <SvgIcon.Info size={28} />
        </div>
      </Container>

      <Dialog
        closeable
        closeOnClickOverlay
        title="关于"
        width="88vw"
        className="max-w-2xl"
        overlayClass="mxwy-action-sheet-overlay"
        visible={aboutVisible}
        showConfirmButton={false}
        onClose={() => setAboutVisible(false)}
      >
        <div
          data-customized-scrollbar
          className="px-6 py-8 max-h-96 overflow-y-auto"
        >
          <div className="font-bold text-green-600">项目简介</div>
          <div className="mt-2">
            <p className="mb-2">教自己小孩拼音识字用的，开源分享给同好的家长们 ❤️</p>
            <p className="mb-2">使用 Netlify 自动部署，国内访问可能比较卡顿，本地部署会好点</p>
            <p className="mb-2">现有 19 条音频（蒙学 7 部、选文 10 篇）已涵盖 xxx 个不重复的汉字，基本满足幼儿的识字需求，因此不再增录，大佬们可自行 fork 处理</p>
            <p className="mb-2">字幕拼音均为本人逐字听取校排，难免有错讹之处，欢迎指正</p>

            <div className="text-center text-sm">
              <a
                target="_blank"
                href="https://github.com/Chisw/mxwy.jsw.im"
                className="text-blue-600"
              >
                GitHub
              </a>
              <span>&emsp;·&emsp;</span>
              <a
                // target="_blank"
                // href=""
              >
                视频介绍
              </a>
            </div>
          </div>

          <div className="mt-4 font-bold text-green-600">感谢</div>
          <div className="mt-2">
            在此由衷感谢 白云出岫 老师，他在朗读经典上所浇筑的心血，普惠大众，功德无量 🙏🏻
          </div>

          <div className="mt-4 font-bold text-green-600">扫码访问</div>
          <div className="mt-2">
            <img src="/assets/qr-code.png" className="mx-auto w-48 h-48" />
          </div>

          <div className="mt-4 font-bold text-green-600">更多蒙学音频</div>
          <div className="mt-2 grid grid-cols-3 gap-1">
            {list.map(({ name, href }, i) => (
              <a
                key={i}
                href={href}
                target="_blank"
                className="text-blue-600"
              >
                {name}
              </a>
            ))}
          </div>
        </div>
      </Dialog>
    </>
  )
}
