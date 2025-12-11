import { useRef } from 'react'
import { useClickAway, usePlayerConfig } from '../../hooks'
import { line } from '../../utils'
import { Slider } from 'react-vant'

interface VolumeSliderProps {
  visible: boolean
  onVolumeChange: (v: number) => void
  onClose: () => void
}

export function VolumeSlider(props: VolumeSliderProps) {

  const {
    visible,
    onVolumeChange,
    onClose,
  } = props

  const { playerConfig, setPlayerConfig } = usePlayerConfig()

  const sliderRef = useRef(null)
  
  useClickAway(sliderRef, onClose)

  return (
    <>
      <div
        ref={sliderRef}
        className={line(`
          absolute z-20
          flex flex-col items-center
          p-2 pb-4 w-12 h-56 bg-white shadow-xl
          border border-zinc-100 rounded-md
          ${visible ? 'block' : 'hidden'}
        `)}
        style={{ right: -12, bottom: 32 }}
      >
        <div className="mb-4 text-xs text-black">
          {(playerConfig.volume * 100).toFixed(0)}%
        </div>
        <Slider
          vertical
          reverse
          min={0}
          max={1}
          barHeight={4}
          step={0.01}
          value={playerConfig.volume}
          onChange={(volume: number) => {
            setPlayerConfig({ volume })
            onVolumeChange(volume)
          }}
        />
      </div>
    </>
  )
}
