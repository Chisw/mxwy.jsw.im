import { useState } from 'react'
import { SvgIcon } from '../SvgIcon'
import { Container } from './Container'
import { Dialog } from 'react-vant'

const refList = [
  { label: 'LOGO', link: 'The Thiings Collection@https://www.thiings.co/things' },
  { label: '背景乐', link: '广陵散-管平湖@https://y.qq.com/n/ryqq_v2/songDetail/000ux1lc3IjIHq' },
  { label: '文本参考', link: '古文岛@https://www.guwendao.net/;5000 言@https://5000yan.com/' },
  { label: '音频打点', link: 'lrc 歌词编辑器@https://lrc.moyutime.cn/' },
  { label: '文字转拼音', link: '中文轉拼音@https://www.ifreesite.com/pinyin/' },
  { label: '字幕拼音字体', link: '印氪先生汉语拼音@https://amazing.zhangzichuan.cn/resources/pinyin-fonts' },
  { label: '字幕汉字字体', link: '方正楷体@https://www.foundertype.com/index.php/FontInfo/index/id/137' },
]

const audioList = [
  { name: '蒙求', url: 'https://www.ximalaya.com/sound/8671778' },
  { name: '千家诗', url: 'https://www.ximalaya.com/album/220988' },
  { name: '小儿语', url: 'https://www.ximalaya.com/sound/171004430' },
  { name: '菜根谭', url: 'https://www.ximalaya.com/sound/6533945' },
  { name: '格言联璧', url: 'https://www.ximalaya.com/sound/7880827' },
  { name: '龙文鞭影', url: 'https://www.ximalaya.com/sound/19790768' },
  { name: '幼学琼林', url: 'https://www.ximalaya.com/sound/7464323' },
  { name: '围炉夜话', url: 'https://www.ximalaya.com/sound/1460802' },
  { name: '小窗幽记', url: 'https://www.ximalaya.com/sound/3549146' },
]

export function Header() {
  const [aboutVisible, setAboutVisible] = useState(false)

  return (
    <>
      <Container
        className="border-b border-white bg-white/90 backdrop-blur-sm"
        innerClassName="flex-between-center py-4"
      >
        <div className="flex items-center">
          <img src="/assets/logo.png" className="w-10 h-10" />
          <div className="ml-2">
            <div className="text-xl font-bold">蒙学文吟</div>
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
        className="max-w-xl"
        overlayClass="mxwy-action-sheet-overlay"
        visible={aboutVisible}
        showConfirmButton={false}
        onClose={() => setAboutVisible(false)}
      >
        <div
          data-customized-scrollbar
          className="mt-4 px-6 md:px-10 pt-4 pb-8 max-h-96 overflow-y-auto [&_a]:text-blue-500 [&_a]:hover:text-blue-600"
        >
          <div className="font-bold text-green-700">简介</div>
          <div className="mt-2 text-sm">
            <p className="mb-2">教自己小孩拼音识字用的，开源分享给同好的家长们 ❤️</p>
            <p className="mb-2">使用 Netlify 免费的自动部署服务，国内访问可能会卡顿，甚至音频无法加载，本地部署会好很多</p>
            <p className="mb-2">现有 19 条音频（蒙学 7 部、选文 10 篇）已涵盖 2600+ 汉字，完全满足幼儿识字需求，因此不再增录，大佬们可自行 fork 处理</p>
            <p className="mb-2">字幕拼音均为本人逐字听取校排，难免有错讹之处，欢迎指正</p>

            <div className="text-sm">
              <a
                target="_blank"
                href="https://github.com/Chisw/mxwy.jsw.im"
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

          <div className="mt-8 font-bold text-green-700">感谢</div>
          <div className="mt-2 text-sm">
            在此由衷感谢 
            <a
              target="_blank"
              href="https://www.ximalaya.com/zhubo/4228109"
              title="喜马拉雅"
            >
              白云出岫
            </a>
            老师，他在朗读经典上所浇筑的心血，普惠大众，功德无量 🙏🏻
          </div>

          <div className="mt-8 font-bold text-green-700">扫码访问</div>
          <div className="mt-2">
            <img src="/assets/qr-code.png" className="w-48 h-48 border border-zinc-200" />
          </div>

          <div className="mt-8 font-bold text-green-700">快捷键</div>
          <div className="mt-2 text-sm leading-loose">
            <pre>
              <code>
                <div>        ↑: 音量+</div>
                <div>        ↓: 音量-</div>
                <div>        ←: 前一句</div>
                <div>        →: 后一句</div>
                <div>Backspace: 当前句重放</div>
                <div>      Esc: 退出字幕</div>
                <div>    Enter: 进入字幕</div>
                <div>    Space: 播放/暂停</div>
              </code>
            </pre>
          </div>

          <div className="mt-8 font-bold text-green-700">引用来源</div>
          <div className="mt-2 text-sm leading-loose">
            {refList.map(({ label, link }, i) => {
              const links = link
                .split(';')
                .map(s => {
                  const [name, url] = s.split('@')
                  return { name, url }
                })

              return (
                <div
                  key={i}
                >
                  <span>{label}：&nbsp;</span>
                  {links.map(({ name, url }, j) => (
                    <a
                      key={j}
                      target="_blank"
                      href={url}
                    >
                      {j === 0 ? '' :'、'}{name}
                    </a>
                  ))}
                </div>
              )
            })}
          </div>

          <div className="mt-8 font-bold text-green-700">更多音频</div>
          <div className="mt-2 grid grid-cols-3 gap-1 text-sm">
            {audioList.map(({ name, url }, i) => (
              <a
                key={i}
                href={url}
                target="_blank"
              >
                《{name}》
              </a>
            ))}
          </div>
        </div>
      </Dialog>
    </>
  )
}
