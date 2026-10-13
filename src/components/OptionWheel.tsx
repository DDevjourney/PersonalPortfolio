import { useEffect, useRef, useState } from 'react'
import type { MouseEvent as ReactMouseEvent, PointerEvent as ReactPointerEvent } from 'react'

interface OptionWheelProps {
  items: readonly string[]
  /** Href de cada item (mismo orden). Si se pasa, los items son enlaces. */
  hrefs?: readonly string[]
  /** Índice inicial cuando el componente no está controlado. */
  defaultSelected?: number
  /** Índice controlado desde fuera (p. ej. el scrollspy). */
  selected?: number
  textColor?: string
  activeColor?: string
  side?: 'left' | 'right'
  /** Tamaño de letra en rem. */
  fontSize?: number
  /** Separación vertical entre items, en múltiplos del tamaño de letra. */
  spacing?: number
  /** Cuánto se curvan los items lejanos hacia el borde (0 = columna recta). */
  curve?: number
  /** Grados de giro por cada paso de distancia al item activo. */
  tilt?: number
  /** Píxeles de desenfoque por paso de distancia. */
  blur?: number
  /** Opacidad que se pierde por paso de distancia (0–1). */
  fade?: number
  /** Duración en ms de la transición al cambiar de item. */
  smoothing?: number
  /** Distancia en px desde el borde de `side`. */
  inset?: number
  loop?: boolean
  draggable?: boolean
  soundUrl?: string
  soundVolume?: number
  className?: string
  ariaLabel?: string
  onChange?: (index: number, item: string) => void
}

/** Movimiento mínimo (px) para que un pointerdown cuente como arrastre y no como click. */
const DRAG_THRESHOLD = 5

/**
 * Lista vertical de opciones dispuesta como una rueda pegada a un lateral: el
 * item activo queda centrado y los demás se alejan curvándose, girando,
 * desenfocándose y apagándose según su distancia. Se cambia de item con click,
 * flechas del teclado o arrastrando en vertical.
 */
export default function OptionWheel({
  items,
  hrefs,
  defaultSelected = 0,
  selected,
  textColor = '#a6a6a6',
  activeColor = '#ffffff',
  side = 'left',
  fontSize = 3,
  spacing = 1.4,
  curve = 1,
  tilt = 6,
  blur = 2,
  fade = 0.25,
  smoothing = 200,
  inset = 80,
  loop = false,
  draggable = false,
  soundUrl,
  soundVolume = 0.5,
  className = '',
  ariaLabel,
  onChange,
}: OptionWheelProps) {
  const [internal, setInternal] = useState(defaultSelected)
  const current = selected ?? internal
  const n = items.length

  // Posición fraccionaria mientras se arrastra; null cuando no hay arrastre.
  const [dragPos, setDragPos] = useState<number | null>(null)
  const drag = useRef<{ startY: number; startPos: number; moved: boolean } | null>(null)
  const suppressClick = useRef(false)
  const audio = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (!soundUrl) return
    const a = new Audio(soundUrl)
    a.volume = soundVolume
    audio.current = a
    return () => {
      audio.current = null
    }
  }, [soundUrl, soundVolume])

  const normalize = (i: number) => (loop ? ((i % n) + n) % n : Math.min(n - 1, Math.max(0, i)))

  const select = (i: number) => {
    const next = normalize(i)
    if (next === current) return
    setInternal(next)
    if (audio.current) {
      audio.current.currentTime = 0
      audio.current.play().catch(() => {})
    }
    onChange?.(next, items[next])
  }

  const stepPx = () => fontSize * spacing * parseFloat(getComputedStyle(document.documentElement).fontSize)

  const onPointerDown = (e: ReactPointerEvent<HTMLElement>) => {
    if (!draggable || e.button !== 0) return
    drag.current = { startY: e.clientY, startPos: current, moved: false }
  }

  const onPointerMove = (e: ReactPointerEvent<HTMLElement>) => {
    const d = drag.current
    if (!d) return
    const dy = e.clientY - d.startY
    if (!d.moved) {
      if (Math.abs(dy) < DRAG_THRESHOLD) return
      d.moved = true
      e.currentTarget.setPointerCapture(e.pointerId)
    }
    let pos = d.startPos - dy / stepPx()
    if (!loop) pos = Math.min(n - 1, Math.max(0, pos))
    setDragPos(pos)
  }

  const endDrag = () => {
    const d = drag.current
    drag.current = null
    if (!d?.moved) return
    suppressClick.current = true
    if (dragPos !== null) select(Math.round(dragPos))
    setDragPos(null)
  }

  // El click que sigue a un arrastre no debe navegar al item que quedó bajo el puntero.
  const onClickCapture = (e: ReactMouseEvent) => {
    if (!suppressClick.current) return
    suppressClick.current = false
    e.preventDefault()
    e.stopPropagation()
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return
    e.preventDefault()
    const next = normalize(current + (e.key === 'ArrowDown' ? 1 : -1))
    select(next)
    const links = e.currentTarget.querySelectorAll<HTMLElement>('[data-wheel-item]')
    links[next]?.focus()
  }

  const pos = dragPos ?? current
  const dir = side === 'left' ? 1 : -1

  return (
    <nav
      aria-label={ariaLabel}
      className={`select-none ${draggable ? 'cursor-grab touch-none active:cursor-grabbing' : ''} ${className}`}
      style={{ fontSize: `${fontSize}rem` }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onClickCapture={onClickCapture}
      onKeyDown={onKeyDown}
    >
      <ul>
        {items.map((item, i) => {
          let d = i - pos
          if (loop) d = ((((d + n / 2) % n) + n) % n) - n / 2
          const dist = Math.abs(d)
          const isActive = i === current && dragPos === null
          // Los lejanos se recogen hacia el borde, como si giraran sobre un eje fuera de pantalla.
          const x = -dir * curve * 0.06 * d * d
          const style: React.CSSProperties = {
            position: 'absolute',
            top: '50%',
            [side]: inset,
            transformOrigin: side === 'left' ? 'left center' : 'right center',
            transform: `translateY(-50%) translate(${x}em, ${d * spacing}em) rotate(${dir * d * tilt}deg)`,
            filter: blur ? `blur(${dist * blur}px)` : undefined,
            opacity: Math.max(0, 1 - dist * fade),
            color: isActive ? activeColor : textColor,
            transition:
              dragPos === null
                ? `transform ${smoothing}ms cubic-bezier(0.16, 1, 0.3, 1), filter ${smoothing}ms, opacity ${smoothing}ms, color ${smoothing}ms`
                : 'color 150ms',
            whiteSpace: 'nowrap',
            lineHeight: 1,
          }
          const common = {
            'data-wheel-item': true,
            'aria-current': i === current ? ('location' as const) : undefined,
            draggable: false,
            style,
            className: 'block outline-none focus-visible:underline focus-visible:decoration-2 focus-visible:underline-offset-4',
          }
          return (
            <li key={item}>
              {hrefs ? (
                <a href={hrefs[i]} {...common} onClick={() => select(i)}>
                  {item}
                </a>
              ) : (
                <button type="button" {...common} onClick={() => select(i)}>
                  {item}
                </button>
              )}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
