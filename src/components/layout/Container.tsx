import type { ReactNode } from 'react'
import { line } from '../../utils'

interface ContainerProps {
  children: ReactNode
  className?: string
  innerClassName?: string
  onClick?: () => void
}

export function Container(props: ContainerProps) {
  const {
    children,
    className,
    innerClassName = '',
    onClick,
  } = props

  return (
    <div className={className} onClick={onClick}>
      <div
        className={line(`
          mx-auto px-4 max-w-5xl
          ${innerClassName}  
        `)}
      >
        {children}
      </div>
    </div>
  )
}
