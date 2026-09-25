import * as React from 'react'
import { motion, useMotionValue, useTransform, type MotionValue, type Transition } from 'motion/react'
import type { EmblaOptionsType, EmblaCarouselType } from 'embla-carousel'
import useEmblaCarousel from 'embla-carousel-react'
import { ChevronRight, ChevronLeft } from 'lucide-react'

/**
 * Carrusel genérico sobre Embla Carousel con animaciones de Motion:
 * adaptado del componente "Motion Carousel" de animate-ui
 * (github.com/imskyleen/animate-ui, PR #159 de arhamkhnz) a la paleta
 * editorial del proyecto (paper/ink) en vez de los colores shadcn
 * genéricos, y generalizado para renderizar cualquier tipo de item en
 * lugar de números de slide fijos.
 */
interface MotionCarouselProps<T> {
  items: readonly T[]
  renderItem: (item: T, isActive: boolean) => React.ReactNode
  getKey: (item: T, index: number) => React.Key
  options?: EmblaOptionsType
  /**
   * Clases con las custom properties `--slide-size`/`--slide-spacing` por
   * breakpoint. Por defecto tunea para tarjetas pequeñas (Skills); un
   * carrusel de tarjetas con más contenido (p. ej. Experiencia) necesita
   * slides más anchos.
   */
  slideSizeClassName?: string
}

const DEFAULT_SLIDE_SIZE_CLASSNAME =
  '[--slide-size:78%] [--slide-spacing:1rem] sm:[--slide-size:48%] md:[--slide-size:32%] lg:[--slide-size:24%]'

interface EmblaControls {
  selectedIndex: number
  scrollSnaps: number[]
  prevDisabled: boolean
  nextDisabled: boolean
  onDotClick: (index: number) => void
  onPrev: () => void
  onNext: () => void
}

interface DotButtonProps {
  selected?: boolean
  label: string
  onClick: () => void
}

const transition: Transition = {
  type: 'spring',
  stiffness: 240,
  damping: 24,
  mass: 1,
}

function useEmblaControls(emblaApi: EmblaCarouselType | undefined): EmblaControls {
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const [scrollSnaps, setScrollSnaps] = React.useState<number[]>([])
  const [prevDisabled, setPrevDisabled] = React.useState(true)
  const [nextDisabled, setNextDisabled] = React.useState(true)

  const onDotClick = React.useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi])
  const onPrev = React.useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const onNext = React.useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  const updateSelectionState = (api: EmblaCarouselType) => {
    setSelectedIndex(api.selectedScrollSnap())
    setPrevDisabled(!api.canScrollPrev())
    setNextDisabled(!api.canScrollNext())
  }

  const onInit = React.useCallback((api: EmblaCarouselType) => {
    setScrollSnaps(api.scrollSnapList())
    updateSelectionState(api)
  }, [])

  const onSelect = React.useCallback((api: EmblaCarouselType) => {
    updateSelectionState(api)
  }, [])

  React.useEffect(() => {
    if (!emblaApi) return

    onInit(emblaApi)
    emblaApi.on('reInit', onInit).on('select', onSelect)

    return () => {
      emblaApi.off('reInit', onInit).off('select', onSelect)
    }
  }, [emblaApi, onInit, onSelect])

  return { selectedIndex, scrollSnaps, prevDisabled, nextDisabled, onDotClick, onPrev, onNext }
}

/**
 * Progreso continuo del scroll (0-1) del carrusel, como `MotionValue` en vez
 * de estado de React: así el parallax de cada slide se anima en cada frame
 * del drag/scroll sin re-renderizar el árbol de React.
 */
function useEmblaScrollProgress(emblaApi: EmblaCarouselType | undefined): MotionValue<number> {
  const scrollProgress = useMotionValue(0)

  React.useEffect(() => {
    if (!emblaApi) return

    const update = () => scrollProgress.set(emblaApi.scrollProgress())
    update()
    emblaApi.on('scroll', update).on('reInit', update)

    return () => {
      emblaApi.off('scroll', update).off('reInit', update)
    }
  }, [emblaApi, scrollProgress])

  return scrollProgress
}

const PARALLAX_SCALE_LOSS = 0.08
const PARALLAX_OPACITY_LOSS = 0.4

interface ParallaxSlideProps {
  progress: MotionValue<number>
  /** Posición de snap de este slide, en el mismo espacio 0-1 que `progress`. */
  target: number
  /** Distancia aproximada entre snaps consecutivos, para normalizar el diff. */
  gap: number
  children: React.ReactNode
}

/** Escala/atenúa un slide según su distancia al punto de scroll activo. */
function ParallaxSlide({ progress, target, gap, children }: ParallaxSlideProps) {
  const scale = useTransform(progress, (p) => {
    const normalized = gap > 0 ? Math.min(Math.abs(target - p) / gap, 1) : 0
    return 1 - normalized * PARALLAX_SCALE_LOSS
  })
  const opacity = useTransform(progress, (p) => {
    const normalized = gap > 0 ? Math.min(Math.abs(target - p) / gap, 1) : 0
    return 1 - normalized * PARALLAX_OPACITY_LOSS
  })

  return (
    <motion.div className="w-full" style={{ scale, opacity }}>
      {children}
    </motion.div>
  )
}

export default function MotionCarousel<T>({
  items,
  renderItem,
  getKey,
  options,
  slideSizeClassName = DEFAULT_SLIDE_SIZE_CLASSNAME,
}: MotionCarouselProps<T>) {
  const [emblaRef, emblaApi] = useEmblaCarousel(options)
  const { selectedIndex, scrollSnaps, prevDisabled, nextDisabled, onDotClick, onPrev, onNext } =
    useEmblaControls(emblaApi)
  const scrollProgress = useEmblaScrollProgress(emblaApi)
  const snapGap = scrollSnaps.length > 1 ? 1 / (scrollSnaps.length - 1) : 1

  return (
    <div className={`w-full space-y-6 ${slideSizeClassName}`}>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-y touch-pinch-zoom">
          {items.map((item, index) => {
            const isActive = index === selectedIndex

            return (
              <div
                key={getKey(item, index)}
                className="mr-[var(--slide-spacing)] flex min-w-0 flex-none basis-[var(--slide-size)]"
              >
                <ParallaxSlide progress={scrollProgress} target={scrollSnaps[index] ?? 0} gap={snapGap}>
                  {renderItem(item, isActive)}
                </ParallaxSlide>
              </div>
            )
          })}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onPrev}
          disabled={prevDisabled}
          aria-label="Anterior"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/80 text-ink transition-all duration-300 hover:bg-ink hover:text-paper disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-ink"
        >
          <ChevronLeft className="size-4" />
        </button>

        <div className="flex flex-wrap items-center justify-end gap-2">
          {scrollSnaps.map((_, index) => (
            <DotButton
              key={index}
              label={`Ir al ${index + 1}`}
              selected={index === selectedIndex}
              onClick={() => onDotClick(index)}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={onNext}
          disabled={nextDisabled}
          aria-label="Siguiente"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/80 text-ink transition-all duration-300 hover:bg-ink hover:text-paper disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-ink"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  )
}

function DotButton({ selected = false, label, onClick }: DotButtonProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label={label}
      layout
      initial={false}
      className="flex cursor-pointer select-none items-center justify-center rounded-full border-none bg-ink text-paper"
      animate={{ width: selected ? 24 : 8, height: 8 }}
      transition={transition}
    />
  )
}
