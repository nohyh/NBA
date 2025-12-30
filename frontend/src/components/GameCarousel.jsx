import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { GameCard } from "./GameCard"
import { useGameByDate } from "../hooks/useGame"
import { getLocalDateString } from "../utils/date"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { CalendarDays } from "lucide-react"

const GameCarousel = () => {
  const today = getLocalDateString()
  const { data } = useGameByDate(today)
  const games = data?.games || []

  if (!games.length) {
    return (
      <Card className="border border-dashed bg-white/70 shadow-sm">
        <CardContent className="flex h-32 items-center justify-center text-sm text-muted-foreground">
          今日暂无比赛
        </CardContent>
      </Card>
    )
  }

  // 比赛数量少时直接展示
  if (games.length <= 4) {
    return (
      <Card className="border bg-white/85 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
          <CardTitle className="text-base flex items-center gap-2">
            <CalendarDays className="w-4 h-4" />
            今日比赛
          </CardTitle>
          <span className="text-xs font-medium text-muted-foreground">{today}</span>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {games.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border bg-white/85 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
        <CardTitle className="text-base flex items-center gap-2">
          <CalendarDays className="w-4 h-4" />
          今日比赛 ({games.length}场)
        </CardTitle>
        <span className="text-xs font-medium text-muted-foreground">{today}</span>
      </CardHeader>
      <CardContent>
        <Carousel opts={{ align: "start" }} className="w-full">
          <CarouselContent className="-ml-4">
            {games.map((game) => (
              <CarouselItem key={game.id} className="pl-4 basis-full sm:basis-1/2 md:basis-1/2 lg:basis-1/2 xl:basis-1/3">
                <GameCard game={game} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-0" />
          <CarouselNext className="right-0" />
        </Carousel>
      </CardContent>
    </Card>
  )
}

export default GameCarousel
