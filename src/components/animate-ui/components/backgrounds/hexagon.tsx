import * as React from 'react'

import { cn } from '@/lib/utils'

/**
 * Fondo de rejilla de hexágonos, adaptado de Animate UI
 * (https://animate-ui.com/docs/components/backgrounds/hexagon) a la
 * paleta editorial paper/ink del proyecto:
 * - Sin hover interactivo ni variantes `dark:` (el original tiene ambos):
 *   aquí es una textura estática y muy sutil, no un elemento "de producto".
 * - El tamaño de la rejilla se mide sobre el propio contenedor (vía
 *   `ResizeObserver`) en vez de `window.innerWidth/innerHeight`: el
 *   original está pensado para cubrir toda la pantalla, este uso solo
 *   cubre la sección en la que se monta.
 */
type HexagonBackgroundProps = React.ComponentProps<'div'> & {
  hexagonSize?: number
  hexagonMargin?: number
}

export function HexagonBackground({
  className,
  children,
  hexagonSize = 75,
  hexagonMargin = 3,
  ...props
}: HexagonBackgroundProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [gridDimensions, setGridDimensions] = React.useState({ rows: 0, columns: 0 })

  const hexagonWidth = hexagonSize
  const hexagonHeight = hexagonSize * 1.1
  const rowSpacing = hexagonSize * 0.8
  const baseMarginTop = -36 - 0.275 * (hexagonSize - 100)
  const computedMarginTop = baseMarginTop + hexagonMargin
  const oddRowMarginLeft = -(hexagonSize / 2)
  const evenRowMarginLeft = hexagonMargin / 2

  React.useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const updateGridDimensions = () => {
      const { width, height } = container.getBoundingClientRect()
      setGridDimensions({
        rows: Math.ceil(height / rowSpacing),
        columns: Math.ceil(width / hexagonWidth) + 1,
      })
    }

    updateGridDimensions()
    const observer = new ResizeObserver(updateGridDimensions)
    observer.observe(container)
    return () => observer.disconnect()
  }, [rowSpacing, hexagonWidth])

  return (
    <div
      ref={containerRef}
      data-slot="hexagon-background"
      className={cn('relative size-full overflow-hidden', className)}
      {...props}
    >
      <style>{`:root { --hexagon-margin: ${hexagonMargin}px; }`}</style>
      <div className="absolute top-0 -left-0 size-full overflow-hidden">
        {Array.from({ length: gridDimensions.rows }).map((_, rowIndex) => (
          <div
            key={`row-${rowIndex}`}
            style={{
              marginTop: computedMarginTop,
              marginLeft: ((rowIndex + 1) % 2 === 0 ? evenRowMarginLeft : oddRowMarginLeft) - 10,
            }}
            className="inline-flex"
          >
            {Array.from({ length: gridDimensions.columns }).map((_, colIndex) => (
              <div
                key={`hexagon-${rowIndex}-${colIndex}`}
                style={{
                  width: hexagonWidth,
                  height: hexagonHeight,
                  marginLeft: hexagonMargin,
                }}
                className={cn(
                  'relative',
                  '[clip-path:polygon(50%_0%,_100%_25%,_100%_75%,_50%_100%,_0%_75%,_0%_25%)]',
                  "before:content-[''] before:absolute before:inset-0 before:bg-ink/[0.06]",
                  "after:content-[''] after:absolute after:inset-[var(--hexagon-margin)] after:bg-paper",
                  'after:[clip-path:polygon(50%_0%,_100%_25%,_100%_75%,_50%_100%,_0%_75%,_0%_25%)]',
                )}
              />
            ))}
          </div>
        ))}
      </div>
      {children}
    </div>
  )
}
