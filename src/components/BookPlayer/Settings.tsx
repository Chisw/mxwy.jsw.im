import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { ActionSheet, Button, Stepper, Switch, Tabs, Notify } from 'react-vant'
import { Container } from '../layout/Container'
import { useRecoilState } from 'recoil'
import { activeBookEntryState, playerConfigState } from '../../states'
import type { IPlayerConfig, ISection, ISentenceRow } from '../../type'
import { getFormatTime, line } from '../../utils'
// import { BlobApi } from '../../api'

const rateList = [0.75, 1, 1.25, 1.5, 2]

function SettingItem(props: { label: string, children: ReactNode, wrap?: boolean }) {
  return (
    <div className={`flex py-3 ${props.wrap ? 'flex-col justify-start' : 'items-center'}`}>
      <div className="shrink-0 w-24 select-none">
        {props.label}
      </div>
      <div className={`grow flex ${props.wrap ? 'mt-2' : 'justify-end ml-2'}`}>
        {props.children}
      </div>
    </div>
  )
}

interface SettingsProps {
  visible: boolean
  section: ISection
  sectionList: ISection[]
  sentenceRowList: ISentenceRow[]
  onSectionChange: (s: ISection) => void
  onPlaybackRateChange: (rate: number) => void
  onClose: () => void
}

export default function Settings(props: SettingsProps) {
  const {
    visible,
    section,
    sectionList,
    sentenceRowList,
    onSectionChange,
    onPlaybackRateChange,
    onClose,
  } = props

  const [activeBookEntry] = useRecoilState(activeBookEntryState)
  const [playerConfig, setPlayerConfig] = useRecoilState(playerConfigState)

  const [activeTab, setActiveTab] = useState('common')
  const [sectionCache, setSectionCache] = useState(section)
  // const [isCached, setIsCached] = useState(false)

  const sentenceCount = useMemo(() => activeBookEntry?.sentences || 1, [activeBookEntry])

  const selectedSentenceCount = useMemo(() => sectionCache.to - sectionCache.from + 1, [sectionCache])

  const selectedDuration = useMemo(() => {
    const { from, to } = sectionCache
    const fromStart = sentenceRowList[from - 1]?.startTime || 0
    const toEnd = sentenceRowList[to - 1]?.endTime || 0

    const seconds = selectedSentenceCount === sentenceCount
      ? activeBookEntry?.seconds || 0
      : toEnd - fromStart

    return getFormatTime(seconds)
  }, [activeBookEntry, sectionCache, selectedSentenceCount, sentenceCount, sentenceRowList])

  const isSectionChanged = useMemo(() => {
    return sectionCache.from !== section.from || sectionCache.to !== section.to
  }, [section, sectionCache])

  const handleConfigChange = useCallback((config: Partial<IPlayerConfig>) => {
    setPlayerConfig({ ...playerConfig, ...config })
  }, [playerConfig, setPlayerConfig])

  const handleApplyClick = useCallback(() => {
    onSectionChange(sectionCache)
    onClose()
    Notify.show({ type: 'success', message: '应用成功' })
  }, [onClose, onSectionChange, sectionCache])

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
      overlayClass="mxwy-settings-overlay"
      duration={200}
      visible={visible}
      onCancel={onClose}
    >
      <Container
        className="pt-2 pb-4"
        innerClassName="min-h-72"
      >

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
                <Stepper
                  integer
                  theme="round"
                  min={10}
                  max={200}
                  step={2}
                  buttonSize={28}
                  value={playerConfig.fontSize}
                  onChange={(v) => handleConfigChange({ fontSize: v! })}
                />
              </SettingItem>

              <SettingItem label="循环播放">
                <Switch
                  size={24}
                  checked={playerConfig.loop}
                  onChange={(loop) => handleConfigChange({ loop })}
                />
              </SettingItem>

              <SettingItem wrap label="播放速度">
                <Button.Group block round size="small">
                  {rateList.map((r) => (
                    <Button
                      key={r}
                      type={r === playerConfig.playbackRate ? 'primary' : 'default'}
                      onClick={() => {
                        handleConfigChange({ playbackRate: r })
                        onPlaybackRateChange(r)
                      }}
                    >
                      <div className="w-8">{`${r.toFixed(2)}x`}</div>
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
              《{activeBookEntry?.title}》{activeBookEntry?.author}
            </div> */}

            <div
              data-customized-scrollbar
              className="mt-4 pb-3 grid grid-cols-3 gap-2"
            >
              {[
                { name: '全部', from: 1, to: sentenceCount },
                ...sectionList,
              ].map((section) => {
                const { name, from, to } = section
                const { from: _from, to: _to } = sectionCache
                const isActive = from === _from && to === _to

                return (
                  <div
                    key={from}
                    className={line(`
                      shrink-0 px-3 py-2 border rounded-lg
                      select-none cursor-pointer
                      ${isActive ? 'border-green-500' : 'border-zinc-200'}
                    `)}
                    onClick={() => setSectionCache(section)}
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
                  max={sectionCache.to - 1}
                  step={1}
                  buttonSize={28}
                  value={sectionCache.from}
                  onChange={(v) => setSectionCache({ ...sectionCache, from: v! })}
                />
              </SettingItem>
              <div className="mb-2 pb-4 truncate text-sm font-kai border-b border-zinc-200">
                {sentenceRowList[sectionCache.from - 1]?.text}
              </div>

              <SettingItem label="终止句">
                <Stepper
                  integer
                  theme="round"
                  min={sectionCache.from + 1}
                  max={activeBookEntry?.sentences || 1000}
                  step={1}
                  buttonSize={28}
                  value={sectionCache.to}
                  onChange={(v) => setSectionCache({ ...sectionCache, to: v! })}
                />
              </SettingItem>
              <div className="mb-2 pb-4 truncate text-sm font-kai">
                {sentenceRowList[sectionCache.to - 1]?.text}
              </div>

              <div className="text-sm text-center text-zinc-400">
                总计 {selectedSentenceCount} 句，时长 {selectedDuration}
              </div>

              <div className="mt-4">
                <Button
                  block
                  round
                  type="primary"
                  disabled={!isSectionChanged}
                  onClick={handleApplyClick}
                >
                  应用
                </Button>
              </div>
            </div>
          </Tabs.TabPane>

          {/* <Tabs.TabPane
            key="cache"
            title="缓存"
          >
            <Button
              onClick={handleCacheClick}
            >
              {isCached ? 'clear' : 'cache'} {bookKey}
            </Button>
          </Tabs.TabPane> */}
        </Tabs>

      </Container>
    </ActionSheet>
  )
}
