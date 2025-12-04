import type { ReactNode } from 'react'
import { ActionSheet, Button, Stepper, Switch } from 'react-vant'
import { SvgIcon } from '../SvgIcon'
import { Container } from '../layout/Container'

const rateList = [0.5, 0.75, 1, 1.25, 1.5, 2]

function SettingItem(props: { label: string, children: ReactNode, wrap?: boolean }) {
  return (
    <div className={`flex py-3 ${props.wrap ? 'flex-col justify-start' : 'items-center'}`}>
      <div className="shrink-0 w-24">
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
  playbackRate: number
  loopCount: number
  onPlaybackRateChange: (rate: number) => void
  onFontSizeChange: (offset: number) => void
  onLoopCountChange: (count: number) => void
  onClose: () => void
}

export default function Settings(props: SettingsProps) {
  const {
    visible,
    playbackRate,
    loopCount,
    onPlaybackRateChange,
    onFontSizeChange,
    onLoopCountChange,
    onClose,
  } = props


  return (
    <ActionSheet
      overlayClass="mxwy-settings-overlay"
      visible={visible}
      onCancel={onClose}
    >
      <Container className="py-4" innerClassName="divide-y divide-zinc-200">

        <SettingItem label="全屏">
          <Button
            icon={document.fullscreen ? <SvgIcon.FullscreenExit /> : <SvgIcon.Fullscreen />}
            onClick={() => {
              if (document.fullscreen) {
                document.exitFullscreen()
              } else {
                document.querySelector('html')?.requestFullscreen()
              }
            }}
          />
        </SettingItem>

        <SettingItem label="字号">
          <Button.Group block round>
            <Button
              icon={<SvgIcon.FontSmall />}
              onClick={() => onFontSizeChange(-2)}
            />
            <Button
              icon={<SvgIcon.FontLarge />}
              onClick={() => onFontSizeChange(+2)}
            />
          </Button.Group>
        </SettingItem>

        <SettingItem wrap label="播放速度">
          <Button.Group block round>
            {rateList.map((r) => (
              <Button
                key={r}
                type={r === playbackRate ? 'primary' : 'default'}
                children={`${r}x`}
                onClick={() => onPlaybackRateChange(r)}
              />
            ))}
          </Button.Group>
        </SettingItem>

        <SettingItem label="整体循环播放">
          <Switch
            size={20}
          />
        </SettingItem>

        <SettingItem label="单句循环次数">
          <Stepper
            min={1}
            max={100}
            step={1}
            value={loopCount}
            onChange={(v) => onLoopCountChange(v || 1)}
          />
        </SettingItem>

      </Container>
    </ActionSheet>
  )
}
