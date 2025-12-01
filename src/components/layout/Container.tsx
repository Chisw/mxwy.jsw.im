import type { ReactNode } from 'react'
import { line } from '../../utils'

interface ContainerProps {
  children: ReactNode
  className?: string
  innerClassName?: string
}

export function Container(props: ContainerProps) {
  const {
    children,
    className,
    innerClassName = '',
  } = props

  return (
    <div className={className}>
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
