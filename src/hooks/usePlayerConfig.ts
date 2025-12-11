import { useCallback, useMemo } from 'react'
import { useRecoilState } from 'recoil'
import { playerConfigState } from '../states'
import { PlayerConfig, type ISection } from '../type'
import { PlayerConfigStorage } from '../utils'

export function usePlayerConfig() {
  const [playerConfig, setPlayerConfig] = useRecoilState(playerConfigState)

  const memoSection = useMemo(() => {
    const key = playerConfig.bookKey
    return key
      ? playerConfig.sectionRecord[key]
      : undefined
  }, [playerConfig])

  const handleConfigChange = useCallback((options: Partial<PlayerConfig>) => {
    const config = { ...playerConfig, ...options }

    setPlayerConfig(config)
    PlayerConfigStorage.set(config)
  }, [playerConfig, setPlayerConfig])

  const setSectionRecord = useCallback((bookKey: string, section: ISection) => {
    const sectionRecord: Record<string, ISection> = {
      ...playerConfig.sectionRecord,
      [bookKey]: section,
    }
    handleConfigChange({ sectionRecord })
  }, [playerConfig, handleConfigChange])

  return {
    playerConfig,
    memoSection,
    setPlayerConfig: handleConfigChange,
    setSectionRecord,
  }
}
