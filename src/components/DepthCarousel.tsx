import * as React from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import './DepthCarousel.css'

/**
 * Pila de tarjetas en profundidad (translateZ + rotateY) que avanza con
 * flechas, puntos, teclado, arrastre o swipe horizontal. Adaptado a
 * TypeScript y a la paleta paper/ink del componente "Depth Carousel" de
 * React Bits (reactbits.dev), y generalizado con `renderItem` en lugar de
 * pintar solo imágenes (mismo criterio de generalización que `FlipCard`).
 */
interface DepthCarouselProps<T> {
  items: readonly T[]
  renderItem: (item: T, isActive: boolean) => React.ReactNode
  getKey: (item: T, index: number) => React.Key
  ariaLabel?: string
  cardWidth?: number
  cardHeight?: number
  radius?: number
  tint?: string
  depth?: number
  spread?: number
  tilt?: number
  tiltDirection?: 'left' | 'right'
  perspective?: number
  visibleCards?: number
  falloff?: number
  blur?: number
  duration?: number
  ease?: string
  autoplay?: boolean
  autoplayDelay?: number
  loop?: boolean
  showControls?: boolean
  showIndicators?: boolean
  onChange?: (index: number, item: T) => void
  className?: string
}

interface DragState {
  x: number
  startPos: number
  lastX: number
  lastT: number
  v: number
  moved: boolean
  id: number
}

const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max)

export default function DepthCarousel<T>({
  items,
  renderItem,
  getKey,
  ariaLabel = 'Carrusel',
  cardWidth = 300,
  cardHeight = 380,
  radius = 18,
  tint = '#1A1A1A',
  depth = 220,
  spread = 90,
  tilt = 22,
  tiltDirection = 'right',
  perspective = 1400,
  visibleCards = 4,
  falloff = 0.2,
  blur = 6,
  duration = 700,
  ease = 'power3.out',
  autoplay = false,
  autoplayDelay = 3200,
  loop = true,
  showControls = true,
  showIndicators = true,
  onChange,
  className = '',
}: DepthCarouselProps<T>) {
  const count = items.length

  const rootRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const overlayRefs = useRef<(HTMLSpanElement | null)[]>([])

  const posRef = useRef(0)
  const focusRef = useRef(0)
  const tweenRef = useRef<gsap.core.Tween | null>(null)
  const scaleRef = useRef(1)
  const onChangeRef = useRef(onChange)

  const dragRef = useRef<DragState | null>(null)
  const wheelTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const autoTimerRef = useRef<number | null>(null)
  const reducedRef = useRef(false)

  const [active, setActive] = useState(0)

  const cfg = {
    count,
    depth,
    spread,
    tilt,
    tiltDirection,
    visibleCards,
    falloff,
    blur,
    duration,
    ease,
    loop,
    cardWidth,
    autoplayDelay,
    showControls,
  }
  const cfgRef = useRef(cfg)
  onChangeRef.current = onChange
  cfgRef.current = cfg

  const updateScale = useCallback(() => {
    const w = rootRef.current?.clientWidth
    if (!w) return
    const c = cfgRef.current
    // Los 120px de margen del original son el hueco de las flechas: sin
    // ellas (móvil), reservarlo encogía las tarjetas hasta dejar el texto
    // ilegible.
    const needed = c.cardWidth + Math.abs(c.spread) * 2 + (c.showControls ? 120 : 24)
    scaleRef.current = clamp(w / needed, 0.4, 1)
  }, [])

  const layout = useCallback((pos: number) => {
    const c = cfgRef.current
    const n = c.count
    if (!n) return
    const dir = c.tiltDirection === 'left' ? -1 : 1
    const sc = scaleRef.current

    for (let i = 0; i < n; i++) {
      const el = cardRefs.current[i]
      if (!el) continue

      let d = i - pos
      if (c.loop && n > 1) {
        d = ((d % n) + n) % n
        if (d > n / 2) d -= n
      }

      const back = Math.max(0, d)
      const az = Math.abs(d)
      const shown = az <= c.visibleCards + 0.5

      const tz = -c.depth * d
      const tx = dir * c.spread * d
      const ry = dir * c.tilt * clamp(d, 0, 1)

      let opacity = d < 0 ? Math.max(0, 1 + d) : 1
      if (!shown) opacity = 0

      const brightness = Math.max(0.15, 1 - back * c.falloff)
      const blurPx = c.blur > 0 ? Math.min(c.blur, (back / Math.max(1, c.visibleCards)) * c.blur) : 0
      const zi = Math.round(2000 - d * 20)

      el.style.transform = `translate(-50%, -50%) scale(${sc}) translateX(${tx.toFixed(2)}px) translateZ(${tz.toFixed(2)}px) rotateY(${ry.toFixed(3)}deg)`
      el.style.opacity = opacity.toFixed(3)
      el.style.filter = `brightness(${brightness.toFixed(3)}) blur(${blurPx.toFixed(2)}px)`
      el.style.zIndex = String(zi)
      el.style.pointerEvents = shown && opacity > 0.05 ? 'auto' : 'none'

      const ov = overlayRefs.current[i]
      if (ov) ov.style.opacity = clamp(back * c.falloff * 1.25, 0, 0.86).toFixed(3)
    }
  }, [])

  const notify = useCallback(
    (idx: number) => {
      setActive(idx)
      onChangeRef.current?.(idx, items[idx])
    },
    [items],
  )

  const tweenTo = useCallback(
    (target: number, animate: boolean) => {
      tweenRef.current?.kill()
      const c = cfgRef.current
      const proxy = { p: posRef.current }
      const dur = animate && !reducedRef.current ? c.duration / 1000 : 0
      tweenRef.current = gsap.to(proxy, {
        p: target,
        duration: dur,
        ease: c.ease,
        onUpdate: () => {
          posRef.current = proxy.p
          layout(proxy.p)
        },
        onComplete: () => {
          const n = c.count
          if (n > 0) posRef.current = ((posRef.current % n) + n) % n
          layout(posRef.current)
        },
      })
    },
    [layout],
  )

  const setFocus = useCallback(
    (rawIndex: number, animate = true) => {
      const c = cfgRef.current
      const n = c.count
      if (!n) return
      const idx = c.loop ? ((rawIndex % n) + n) % n : clamp(rawIndex, 0, n - 1)
      let delta = idx - posRef.current
      if (c.loop && n > 1) {
        delta = ((delta % n) + n) % n
        if (delta > n / 2) delta -= n
      }
      tweenTo(posRef.current + delta, animate)
      if (idx !== focusRef.current) {
        focusRef.current = idx
        notify(idx)
      }
    },
    [tweenTo, notify],
  )

  const navigateBy = useCallback((step: number) => setFocus(focusRef.current + step, true), [setFocus])

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const ro = new ResizeObserver(() => {
      updateScale()
      layout(posRef.current)
    })
    ro.observe(root)
    return () => ro.disconnect()
  }, [layout, updateScale])

  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    const onWheel = (e: WheelEvent) => {
      const c = cfgRef.current
      if (c.count < 2) return
      // Solo el gesto horizontal (swipe de trackpad) mueve el carrusel. El
      // original capturaba también la rueda vertical, y en una landing de
      // scroll vertical eso atrapaba la página al pasar por encima.
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return
      e.preventDefault()
      tweenRef.current?.kill()
      const delta = e.deltaMode === 1 ? e.deltaX * 24 : e.deltaX
      const step = clamp(delta / (c.cardWidth * 0.9), -0.6, 0.6)
      posRef.current += step
      layout(posRef.current)
      if (wheelTimerRef.current) clearTimeout(wheelTimerRef.current)
      wheelTimerRef.current = setTimeout(() => setFocus(Math.round(posRef.current), true), 130)
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => {
      el.removeEventListener('wheel', onWheel)
      if (wheelTimerRef.current) clearTimeout(wheelTimerRef.current)
    }
  }, [layout, setFocus])

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (cfgRef.current.count < 2) return
    tweenRef.current?.kill()
    dragRef.current = {
      x: e.clientX,
      startPos: posRef.current,
      lastX: e.clientX,
      lastT: performance.now(),
      v: 0,
      moved: false,
      id: e.pointerId,
    }
  }, [])

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const drag = dragRef.current
      if (!drag) return
      const stepPx = Math.max(cfgRef.current.cardWidth * 0.55 * scaleRef.current, 40)
      const dx = e.clientX - drag.x
      if (!drag.moved && Math.abs(dx) > 4) {
        drag.moved = true
        // Con la captura en el root, el click que sigue al arrastre cae en el
        // root y no en el enlace de la tarjeta: soltar tras arrastrar no abre
        // el proyecto.
        rootRef.current?.setPointerCapture(drag.id)
      }
      if (!drag.moved) return
      const now = performance.now()
      const dt = Math.max(now - drag.lastT, 1)
      drag.v = (e.clientX - drag.lastX) / dt
      drag.lastX = e.clientX
      drag.lastT = now
      posRef.current = drag.startPos - dx / stepPx
      layout(posRef.current)
    },
    [layout],
  )

  const onPointerEnd = useCallback(() => {
    const drag = dragRef.current
    if (!drag) return
    dragRef.current = null
    if (!drag.moved) return
    const stepPx = Math.max(cfgRef.current.cardWidth * 0.55 * scaleRef.current, 40)
    const projected = posRef.current - (drag.v * 180) / stepPx
    setFocus(Math.round(projected), true)
  }, [setFocus])

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        navigateBy(-1)
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        navigateBy(1)
      }
    },
    [navigateBy],
  )

  const onCardClick = useCallback(
    (index: number) => {
      if (dragRef.current?.moved) return
      setFocus(index, true)
    },
    [setFocus],
  )

  useEffect(() => {
    reducedRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!autoplay || reducedRef.current || count < 2) return
    const root = rootRef.current
    let hovered = false
    let focused = false
    const stop = () => {
      if (autoTimerRef.current) clearInterval(autoTimerRef.current)
      autoTimerRef.current = null
    }
    const start = () => {
      stop()
      autoTimerRef.current = window.setInterval(
        () => {
          if (!hovered && !focused) navigateBy(1)
        },
        Math.max(cfgRef.current.autoplayDelay, 600),
      )
    }
    const onEnter = () => {
      hovered = true
    }
    const onLeave = () => {
      hovered = false
    }
    const onFocusIn = () => {
      focused = true
    }
    const onFocusOut = () => {
      focused = false
    }
    root?.addEventListener('mouseenter', onEnter)
    root?.addEventListener('mouseleave', onLeave)
    root?.addEventListener('focusin', onFocusIn)
    root?.addEventListener('focusout', onFocusOut)
    start()
    return () => {
      stop()
      root?.removeEventListener('mouseenter', onEnter)
      root?.removeEventListener('mouseleave', onLeave)
      root?.removeEventListener('focusin', onFocusIn)
      root?.removeEventListener('focusout', onFocusOut)
    }
  }, [autoplay, autoplayDelay, count, navigateBy])

  useEffect(() => {
    updateScale()
    layout(posRef.current)
  }, [
    layout,
    updateScale,
    depth,
    spread,
    tilt,
    tiltDirection,
    visibleCards,
    falloff,
    blur,
    cardWidth,
    cardHeight,
    radius,
    count,
    showControls,
  ])

  useEffect(
    () => () => {
      tweenRef.current?.kill()
      if (wheelTimerRef.current) clearTimeout(wheelTimerRef.current)
      if (autoTimerRef.current) clearInterval(autoTimerRef.current)
    },
    [],
  )

  return (
    <div
      ref={rootRef}
      className={`depth-carousel ${className}`.trim()}
      style={{ '--dc-perspective': `${perspective}px` } as React.CSSProperties}
      role="group"
      aria-roledescription="carrusel"
      aria-label={ariaLabel}
      tabIndex={0}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerEnd}
      onPointerCancel={onPointerEnd}
      onKeyDown={onKeyDown}
    >
      <div className="depth-carousel__stage">
        {items.map((item, i) => (
          <div
            key={getKey(item, i)}
            className="depth-carousel__card"
            ref={(el) => {
              cardRefs.current[i] = el
            }}
            style={{ width: cardWidth, height: cardHeight, borderRadius: radius }}
            role="group"
            aria-roledescription="diapositiva"
            aria-label={`${i + 1} de ${count}`}
            aria-hidden={active !== i}
            onClick={() => onCardClick(i)}
          >
            {renderItem(item, active === i)}
            <span
              className="depth-carousel__tint"
              ref={(el) => {
                overlayRefs.current[i] = el
              }}
              style={{ background: tint }}
            />
          </div>
        ))}
      </div>

      {showControls && count > 1 && (
        <>
          <button
            type="button"
            className="depth-carousel__arrow depth-carousel__arrow--prev"
            aria-label="Anterior"
            onClick={() => navigateBy(-1)}
          >
            <ChevronLeft className="size-4" aria-hidden />
          </button>
          <button
            type="button"
            className="depth-carousel__arrow depth-carousel__arrow--next"
            aria-label="Siguiente"
            onClick={() => navigateBy(1)}
          >
            <ChevronRight className="size-4" aria-hidden />
          </button>
        </>
      )}

      {showIndicators && count > 1 && (
        <div className="depth-carousel__dots">
          {items.map((item, i) => (
            <button
              key={getKey(item, i)}
              type="button"
              aria-current={active === i}
              aria-label={`Ir a la tarjeta ${i + 1}`}
              className={`depth-carousel__dot${active === i ? ' is-active' : ''}`}
              onClick={() => setFocus(i, true)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
