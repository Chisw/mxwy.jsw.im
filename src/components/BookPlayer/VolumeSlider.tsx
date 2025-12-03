import { useRef, useState } from 'react'
import { useClickAway } from '../../hooks'
import { line } from '../../utils'
import { Slider } from 'react-vant'

interface VolumeSliderProps {
  show: boolean
  volume: number
  onClose: () => void
  onVolumeChange: (vol: number) => void
}

export function VolumeSlider(props: VolumeSliderProps) {

  const {
    show,
    volume,
    onClose,
    onVolumeChange,
  } = props

  const [value, setValue] = useState(volume)

  const sliderRef = useRef(null)
  
  useClickAway(sliderRef, onClose)

  return (
    <>
      <div
        ref={sliderRef}
        className={line(`
          absolute z-20
          flex flex-col items-center
          p-2 pb-4 w-10 h-56 rounded-md bg-white shadow-lg
          ${show ? 'block' : 'hidden'}
        `)}
        style={{ right: -8, bottom: 32 }}
      >
        <div className="mb-4 text-xs text-black">
          {(value * 100).toFixed(0)}%
        </div>
        <Slider
          vertical
          reverse
          min={0}
          max={1}
          step={.01}
          value={value}
          onChangeAfter={(v: number) => {
            setValue(v)
            onVolumeChange(v)
          }}
        />
      </div>
    </>
  )
}
