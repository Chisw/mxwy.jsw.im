import { ActionSheet, Button } from 'react-vant'
import { SvgIcon } from '../SvgIcon'
import { Container } from '../layout/Container'

const rateList = [0.5, 0.75, 1, 1.25, 1.5, 2]

interface SettingsProps {
  visible: boolean
  playbackRate: number
  onPlaybackRateChange: (rate: number) => void
  onFontSizeChange: (offset: number) => void
  onClose: () => void
}

export default function Settings(props: SettingsProps) {
  const {
    visible,
    playbackRate,
    onPlaybackRateChange,
    onFontSizeChange,
    onClose,
  } = props


  return (
    <ActionSheet
      visible={visible}
      onCancel={onClose}
    >
      <Container className="py-4">
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
      </Container>
    </ActionSheet>
  )
}
