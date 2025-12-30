import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { useNews } from "@/hooks/useNews"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

const NewsCarousel = () => {
    const { data: news, isLoading } = useNews()

    if (isLoading) {
        return <Skeleton className="h-[360px] w-full rounded-3xl" />
    }

    if (!news?.length) return null

    return (
        <Card className="h-[360px] overflow-hidden border bg-white/80 shadow-sm">
            <Carousel opts={{ align: "start", loop: true }} className="h-full">
                <CarouselContent className="h-full">
                    {news.map((item) => (
                        <CarouselItem key={item.id} className="relative h-[360px]">
                            <a
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex h-full items-center justify-center bg-muted/40"
                            >
                                <img
                                    src={item.imageUrl}
                                    alt={item.title}
                                    className="max-h-full max-w-full object-contain"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                <div className="absolute bottom-0 left-0 right-0 p-6">
                                    <p className="text-white text-lg font-semibold line-clamp-2">
                                        {item.title}
                                    </p>
                                </div>
                            </a>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="left-4" />
                <CarouselNext className="right-4" />
            </Carousel>
        </Card>
    )
}

export default NewsCarousel
