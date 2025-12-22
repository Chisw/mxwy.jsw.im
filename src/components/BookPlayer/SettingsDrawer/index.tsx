import { useCallback, useMemo, useState } from 'react'
import { ActionSheet, Button, Stepper, Switch, Tabs, Notify } from 'react-vant'
import type { IBookEntry, ISection, ISentence } from '../../../type'
import {
  BACKGROUND_MUSIC_EVENT_TRIGGER,
  downloadTxt,
  getDefaultSection,
  getFormatTime,
  line,
  printSentenceList,
  scrollToActiveSentence,
} from '../../../utils'
import { usePlayerConfig } from '../../../hooks'
import { SettingItem } from './SettingItem'
import { SvgIcon } from '../../SvgIcon'
// import { BlobApi } from '../../api'

const RATE_LIST = [0.75, 1, 1.25, 1.5]

interface SettingsDrawerProps {
  visible: boolean
  bookEntry: IBookEntry
  sectionList: ISection[]
  sentenceList: ISentence[]
  onPlaybackRateChange: (rate: number) => void
  onClose: () => void
}

export default function SettingsDrawer(props: SettingsDrawerProps) {
  const {
    visible,
    bookEntry,
    sectionList,
    sentenceList,
    onPlaybackRateChange,
    onClose,
  } = props

  const defaultSection = getDefaultSection(bookEntry)

  const { playerConfig, memoSection, setPlayerConfig, setSectionRecord } = usePlayerConfig()

  const [activeTab, setActiveTab] = useState('common')
  const [sectionForm, setSectionForm] = useState(memoSection || defaultSection)
  // const [isCached, setIsCached] = useState(false)

  const sentenceCount = useMemo(() => {
    return bookEntry.sentences || 0
  }, [bookEntry])

  const selectedSentenceCount = useMemo(() => {
    return sectionForm.to - sectionForm.from + 1
  }, [sectionForm])

  const selectedDuration = useMemo(() => {
    const { from, to } = sectionForm
    const fromStart = sentenceList[from - 1]?.startTime || 0
    const toEnd = sentenceList[to - 1]?.endTime || 0

    const seconds = selectedSentenceCount === sentenceCount
      ? bookEntry.seconds || 0
      : toEnd - fromStart

    return getFormatTime(seconds)
  }, [bookEntry, sectionForm, selectedSentenceCount, sentenceCount, sentenceList])

  const isSectionFromDirty = useMemo(() => {
    const { from, to } = memoSection || defaultSection
    return sectionForm.from !== from || sectionForm.to !== to
  }, [defaultSection, memoSection, sectionForm])

  const handleAutoSizeClick = useCallback(() => {
    const maxCount = sentenceList
      .map(s => s.text.length)
      .reduce((a, b) => a > b ? a : b, 0)

    const size = window.innerWidth / maxCount / 2.2
    const fontSize = size - size % 2
    setPlayerConfig({ fontSize })
    Notify.show({ type: 'success', message: `字号 ${fontSize} 设置成功` })
    setTimeout(scrollToActiveSentence, 1)
  }, [sentenceList, setPlayerConfig])

  const handleApplyClick = useCallback(() => {
    setSectionRecord(bookEntry.key, sectionForm)
    // onClose()
    Notify.show({ type: 'success', message: '应用成功' })
  }, [setSectionRecord, bookEntry, sectionForm])

  const handleDownloadClick = useCallback((type: string) => {
    const { title, author } = bookEntry
    let textContent = ''

    if (type === 'txt') {
      textContent = [
        sentenceList.map(({ text, pinyin }) => `${pinyin}\n${text}`).join('\n'),
        '',
      ].join('\n')
    } else if (type === 'json') {
      textContent = JSON.stringify({ ...bookEntry, sectionList, sentenceList })
    } else if (type === 'lrc') {
      textContent = [
        `[ti:${title}]`,
        `[au:${author}]`,
        `[ar:白云出岫]`,
        sentenceList.map(({ time, text }) => `[${time}]${text}`).join('\n'),
        '',
      ].join('\n')
    }

    downloadTxt(`${title}-${author}.${type}`, textContent)
  }, [bookEntry, sectionList, sentenceList])

  // const handleFetchCache = useCallback(async () => {
  //   const res = await BlobApi.fetchAudioBlob(bookKey)
  //   console.log(123, res)
  //   if (res) {
  //     setIsCached(true)
  //   }
  // }, [bookKey])

  // const handleCacheClick = useCallback(async () => {
  //   if (isCached) {
  //     const res = await BlobApi.clearAudioBlob(bookKey)
  //     setIsCached(false)
  //     console.log(1234, res)
  //   } else {
  //     BlobApi.cacheAudioBlob(bookKey, (received, total) => {
  //       console.log(received, total)
  //     })
  //     setIsCached(true)
  //   }
  // }, [bookKey, isCached])

  // useEffect(() => {
  //   handleFetchCache()
  // }, [handleFetchCache])

  return (
    <ActionSheet
      overlayClass="mxwy-action-sheet-overlay"
      duration={200}
      visible={visible}
      onCancel={onClose}
    >
      <div className="pt-2 pb-4 mx-auto px-4 max-w-lg min-h-72">

        <Tabs
          active={activeTab}
          onChange={(t) => setActiveTab(t as string)}
        >
          <Tabs.TabPane
            key="common"
            title="通用"
          >
            <div className="divide-y divide-zinc-200">
              <SettingItem label="全屏">
                <Switch
                  size={24}
                  checked={document.fullscreen}
                  onChange={() => {
                    if (document.fullscreen) {
                      document.exitFullscreen()
                    } else {
                      document.querySelector('html')?.requestFullscreen()
                    }
                  }}
                />
              </SettingItem>

              <SettingItem label="字号">
                <div className="flex items-center">
                  <Button
                    round
                    size="small"
                    onClick={handleAutoSizeClick}
                  >
                    Auto
                  </Button>
                  <Stepper
                    integer
                    theme="round"
                    className="ml-4"
                    min={10}
                    max={200}
                    step={2}
                    buttonSize={28}
                    value={playerConfig.fontSize}
                    onChange={(v) => {
                      setPlayerConfig({ fontSize: v! })
                      setTimeout(scrollToActiveSentence, 1)
                    }}
                  />
                </div>
                </SettingItem>

              <SettingItem label="字幕滚动">
                <Switch
                  size={24}
                  checked={playerConfig.autoScroll}
                  onChange={(autoScroll) => setPlayerConfig({ autoScroll })}
                />
              </SettingItem>

              <SettingItem label="句子面板">
                <Switch
                  size={24}
                  checked={playerConfig.sentencePanel}
                  onChange={(sentencePanel) => setPlayerConfig({ sentencePanel })}
                />
              </SettingItem>

              <SettingItem label="背景乐">
                <Switch
                  size={24}
                  checked={playerConfig.backgroundMusic}
                  onChange={(backgroundMusic) => {
                    setPlayerConfig({ backgroundMusic })
                    const event = new CustomEvent(BACKGROUND_MUSIC_EVENT_TRIGGER, {
                      detail: backgroundMusic,
                    })
                    window.dispatchEvent(event)
                  }}
                />
              </SettingItem>

              <SettingItem label="循环播放">
                <Switch
                  size={24}
                  checked={playerConfig.loop}
                  onChange={(loop) => setPlayerConfig({ loop })}
                />
              </SettingItem>

              <SettingItem label="播放速度">
                <Button.Group block round size="small">
                  {RATE_LIST.map((r) => (
                    <Button
                      key={r}
                      type={r === playerConfig.playbackRate ? 'primary' : 'default'}
                      onClick={() => {
                        setPlayerConfig({ playbackRate: r })
                        onPlaybackRateChange(r)
                      }}
                    >
                      {r}&times;
                    </Button>
                  ))}
                </Button.Group>
              </SettingItem>
            </div>
          </Tabs.TabPane>

          <Tabs.TabPane
            key="section"
            title="播放区间"
          >
            {/* <div className="py-6 font-bold text-center">
              《{bookEntry.title}》{bookEntry.author}
            </div> */}

            <div
              data-customized-scrollbar
              className="mt-4 pb-3 grid grid-cols-3 gap-2"
            >
              {[
                defaultSection,
                ...sectionList,
              ].map((section) => {
                const { name, from, to } = section
                const { from: _from, to: _to } = sectionForm
                const isActive = from === _from && to === _to

                return (
                  <div
                    key={`${from}-${to}`}
                    className={line(`
                      shrink-0 px-3 py-2 border rounded-lg
                      select-none cursor-pointer
                      ${isActive ? 'border-green-500' : 'border-zinc-200'}
                    `)}
                    onClick={() => setSectionForm(section)}
                  >
                    <div className="flex-between-center text-sm font-bold truncate">
                      {name}
                    </div>
                  </div>
                )
              })}
            </div>

            <div>
              <SettingItem label="起始句">
                <Stepper
                  integer
                  theme="round"
                  min={1}
                  max={sectionForm.to - 1}
                  step={1}
                  buttonSize={28}
                  value={sectionForm.from}
                  onChange={(v) => setSectionForm({ ...sectionForm, name: '自定义', from: v! })}
                />
              </SettingItem>
              <div className="mb-2 pb-4 truncate text-lg font-kai border-b border-zinc-200">
                {sentenceList[sectionForm.from - 1]?.text}
              </div>

              <SettingItem label="终止句">
                <Stepper
                  integer
                  theme="round"
                  min={sectionForm.from + 1}
                  max={bookEntry.sentences || 1000}
                  step={1}
                  buttonSize={28}
                  value={sectionForm.to}
                  onChange={(v) => setSectionForm({ ...sectionForm, name: '自定义', to: v! })}
                />
              </SettingItem>
              <div className="mb-2 pb-4 truncate text-lg font-kai">
                {sentenceList[sectionForm.to - 1]?.text}
              </div>

              <div className="text-sm text-center text-zinc-400">
                <span>总计 {selectedSentenceCount} 句，时长 {selectedDuration}</span>
                <span
                  className="ml-3 text-green-600 cursor-pointer"
                  onClick={() => printSentenceList(sentenceList, sectionForm)}
                >
                  打印字帖
                </span>
              </div>

              <div className="mt-4">
                <Button
                  block
                  round
                  type="primary"
                  disabled={!isSectionFromDirty}
                  onClick={handleApplyClick}
                >
                  {isSectionFromDirty ? '' : '已'}应用
                </Button>
              </div>
            </div>
          </Tabs.TabPane>

          <Tabs.TabPane
            key="more"
            title="更多"
          >
            <div className="py-4 grid grid-cols-2 gap-3">
              {['txt', 'json', 'lrc'].map((t) => (
                <Button
                  key={t}
                  round
                  size="small"
                  icon={<SvgIcon.Download />}
                  onClick={() => handleDownloadClick(t)}
                >
                  保存为 .{t}
                </Button>
              ))}
            </div>

            {/* <Button
              onClick={handleCacheClick}
            >
              {isCached ? 'clear' : 'cache'} {bookKey}
            </Button> */}
          </Tabs.TabPane>
        </Tabs>

      </div>
    </ActionSheet>
  )
}
