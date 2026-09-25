import * as React from 'react'
import { motion, type Transition } from 'motion/react'
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
}

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

export default function MotionCarousel<T>({ items, renderItem, getKey, options }: MotionCarouselProps<T>) {
  const [emblaRef, emblaApi] = useEmblaCarousel(options)
  const { selectedIndex, scrollSnaps, prevDisabled, nextDisabled, onDotClick, onPrev, onNext } =
    useEmblaControls(emblaApi)

  return (
    <div className="w-full space-y-6 [--slide-size:78%] [--slide-spacing:1rem] sm:[--slide-size:48%] md:[--slide-size:32%] lg:[--slide-size:24%]">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-y touch-pinch-zoom">
          {items.map((item, index) => {
            const isActive = index === selectedIndex

            return (
              <div
                key={getKey(item, index)}
                className="mr-[var(--slide-spacing)] flex min-w-0 flex-none basis-[var(--slide-size)]"
              >
                <motion.div
                  className="w-full"
                  initial={false}
                  animate={{ scale: isActive ? 1 : 0.92, opacity: isActive ? 1 : 0.6 }}
                  transition={transition}
                >
                  {renderItem(item, isActive)}
                </motion.div>
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
