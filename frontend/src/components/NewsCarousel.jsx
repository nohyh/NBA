import { Carousel, CarouselContent, CarouselItem ,CarouselNext,CarouselPrevious} from "@/components/ui/carousel"
import {useNews} from "@/hooks/useNews";
const NewsCarousel = () => {
    const {data:news} = useNews();
    if(!news) return null;//这里可以换成骨架
    return (
        <div className="flex w-full h-[400px] rounded-3xl overflow-hidden shadow-xl">
        <Carousel opts={{
                align:"start",
                loop:true,       
            } }>
            <CarouselContent>
                {news&&news.map((item) =>(
                    <CarouselItem key={item.id} className={' relative h-[400px]'}>
                    <a href={item.url} target="_blank" rel="noopener noreferrer">
                      <img src={item.imageUrl} alt={item.title} className={'inset-0 h-full w-full object-cover'} />
                      <div className="absolute bottom-0 w-full p-4 bg-gradient-to-t from-black to-transparent">
                        <p className="text-white text-lg font-semibold line-clamp-2">{item.title}</p>
                      </div>
                    </a>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselNext />
            <CarouselPrevious />
        </Carousel>
        </div>
    );
};

export default NewsCarousel;
