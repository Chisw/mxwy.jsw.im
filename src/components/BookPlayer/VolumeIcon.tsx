import { SvgIcon } from '../SvgIcon'

interface VolumeIconProps {
  size: number
  volume: number
}

export function VolumeIcon({ size, volume }: VolumeIconProps) {
    if (volume > .5) {
      return <SvgIcon.VolumeUp size={size} />
    } else if (volume === 0) {
      return <SvgIcon.VolumeMute size={size} />
    } else {
      return <SvgIcon.VolumeDown size={size} />
    }
}
