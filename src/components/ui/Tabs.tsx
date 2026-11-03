import { useRef } from 'react'

export interface TabItem<T extends string> {
  id: T
  label: string
  shortLabel?: string
  icon?: React.ReactNode
}

interface TabsProps<T extends string> {
  items: TabItem<T>[]
  value: T
  onChange: (value: T) => void
  label: string
  variant?: 'main' | 'sub' | 'compact'
}

export function Tabs<T extends string>({ items, value, onChange, label, variant = 'sub' }: TabsProps<T>) {
  const refs = useRef<(HTMLButtonElement | null)[]>([])

  function onKeyDown(event: React.KeyboardEvent, index: number) {
    let next = index
    if (event.key === 'ArrowRight') next = (index + 1) % items.length
    else if (event.key === 'ArrowLeft') next = (index - 1 + items.length) % items.length
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = items.length - 1
    else return
    event.preventDefault()
    onChange(items[next].id)
    refs.current[next]?.focus()
  }

  return (
    <div className={`tabs tabs-${variant}`} role="tablist" aria-label={label}>
      {items.map((item, index) => (
        <button
          key={item.id}
          ref={(node) => { refs.current[index] = node }}
          type="button"
          role="tab"
          id={`tab-${label}-${item.id}`}
          aria-selected={value === item.id}
          aria-controls={`panel-${label}-${item.id}`}
          tabIndex={value === item.id ? 0 : -1}
          className={value === item.id ? 'tab active' : 'tab'}
          onClick={() => onChange(item.id)}
          onKeyDown={(event) => onKeyDown(event, index)}
        >
          {item.icon}
          <span>{item.label}</span>
        </button>
      ))}
    </div>
  )
}
