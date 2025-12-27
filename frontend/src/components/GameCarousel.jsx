import { Carousel, CarouselContent, CarouselItem ,CarouselNext,CarouselPrevious} from "@/components/ui/carousel"
import {GameCard} from "./GameCard"
import { useGameByDate } from "../hooks/useGame"
import { getETDate } from "../utils/date"
const GameCarousel = () => {
  const {data} = useGameByDate(getETDate())
  const TodaysGame = data?.games||[]
    if(TodaysGame.length<=4){
        return(
            <div className="flex justify-center gap-4">
                {TodaysGame.map((game)=>(
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
          {TodaysGame && TodaysGame.map((game) => (
            <CarouselItem key={game.id} className="flex-none w-80">
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
