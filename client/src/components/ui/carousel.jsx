
import useEmblaCarousel from 'embla-carousel-react'
import { useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export function Carousel({ children }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  return (
    <div className="relative w-full">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">{children}</div>
      </div>

      <Button
        size="icon"
        variant="secondary"
        onClick={scrollPrev}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 rounded-full shadow"
      >
        <ChevronLeft className="w-5 h-5" />
      </Button>

      <Button
        size="icon"
        variant="secondary"
        onClick={scrollNext}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 rounded-full shadow"
      >
        <ChevronRight className="w-5 h-5" />
      </Button>
    </div>
  )
}
