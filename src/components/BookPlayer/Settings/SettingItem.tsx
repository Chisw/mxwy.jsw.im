import type { ReactNode } from 'react'

export function SettingItem(props: { label: string, children: ReactNode, wrap?: boolean }) {
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
