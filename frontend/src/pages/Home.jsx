import { Card, CardContent } from "@/components/ui/card"
import { useGameByDate} from "../hooks/useGame"
import {getETDate} from "../utils/date"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
const Home = () => {

  const {data,isLoading,error} = useGameByDate(getETDate())
  const TodaysGame = data?.games
  return (
    <div>
      <Carousel
        opts={{
          align: "start",
        }}
        className="w-full max-w-5xl mx-auto"
      >
        <CarouselContent>
          {TodaysGame && TodaysGame.map((game) => (
            <CarouselItem key={game.id} className="flex-none w-48">
              <div className="p-1">
                <Card >
                  <CardContent className="flex  items-center justify-center p-6">
                    <span className="text-xs font-semibold mr-5"  >{game.homeTeam.abbreviation}</span>
                    <span className="text-xs font-semibold ml-5">{game.awayTeam.abbreviation}</span>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4" />
        <CarouselNext className="right-4" />
      </Carousel>
    </div>

  )
}
export default Home