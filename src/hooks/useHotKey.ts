import { useEffect } from 'react'

interface useHotKeyProps {
  binding: boolean
  fnMap: {[KEY: string]: () => void | null }
}

export function useHotKey(props: useHotKeyProps) {
  const {
    binding,
    fnMap,
  } = props

  useEffect(() => {
    const fnKeyList = Object.keys(fnMap)

    const listener = (e: any) => {
      if (document.querySelector('.gagu-prevent-hotkeys-overlay')) return

      const { code, altKey, ctrlKey, metaKey, shiftKey } = e

      const pressedHotKey = [
        ctrlKey ? 'Ctrl+' : '',
        metaKey ? 'Meta+' : '',
        altKey ? 'Alt+' : '',
        shiftKey ? 'Shift+' : '',
        code,
      ].join('')

      // const styleIndex = {
      //   [HotkeyStyle.mac]: 0,
      //   [HotkeyStyle.win]: 1,
      // }[hotkeyStyle]

      const fnKey = fnKeyList.find(key => key.split(', ')[0] === pressedHotKey)

      if (fnKey) {
        e.preventDefault()
        if (fnMap[fnKey]) {
          fnMap[fnKey]()
        }
      }
    }

    const bind = () => document.addEventListener('keydown', listener)
    const unbind = () => document.removeEventListener('keydown', listener)

    if (binding) {
      bind()
    } else {
      unbind()
    }
    return unbind
  }, [binding, fnMap])

}
