import { Carousel, CarouselContent, CarouselItem ,CarouselNext,CarouselPrevious} from "@/components/ui/carousel"
import GameCard from "./GameCard"
const GameCarousel = ({ games =[] }) => {
    if(games.length<=4){
        return(
            <div className="flex justify-center gap-4">
                {games.map((game)=>(
                    <GameCard key={game.id} game={game}/>
                ))}
            </div>
        )
    }
return(
  <Carousel
        opts={{
          align: "start",
        }}
        className="w-full max-w-8xl mx-auto px-16"
      >
        <CarouselContent>
          {games && games.map((game) => (
            <CarouselItem key={game.id} className="flex-none w-72">
              <div className="p-1">
                <GameCard game={game} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2" />
        <CarouselNext className="right-2" />
      </Carousel>
)}

export default GameCarousel
