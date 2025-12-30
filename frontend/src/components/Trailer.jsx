import { useAuth } from "../context/AuthContext"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./ui/carousel"
import { useGameByTeam } from "@/hooks/useGame"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatLocalDateYmd } from "../utils/date"

const TeamNextTeam = ({ team }) => {
    const { data: { games = [] } = {} } = useGameByTeam(team.id)
    const today = new Date().setHours(0, 0, 0, 0)
    const nextGame = games?.find((game) => new Date(game.gameDate) >= today)
    if (!nextGame) {
        return null
    }
    return (
        <div className="flex items-center justify-between rounded-2xl border bg-white/80 px-4 py-3 shadow-sm">
            <div className="flex items-center gap-3">
                <img className="h-10 w-10" src={team.logoUrl} alt={team.name} />
                <div className="min-w-0">
                    <p className="text-sm font-semibold truncate">{team.fullName}</p>
                    <p className="text-xs text-muted-foreground">下一场比赛</p>
                </div>
            </div>
            <span className="text-sm font-semibold text-muted-foreground">
                {formatLocalDateYmd(nextGame?.gameDate)}
            </span>
        </div>
    )
}
const Trailer = () => {
    const { user } = useAuth()
    const teams = user?.favoriteTeams
    if (!teams?.length) {
        return null
    }
    return (
        <Card className="border bg-white/85 shadow-sm">
            <CardHeader className="pb-2">
                <CardTitle className="text-base">关注球队赛程</CardTitle>
            </CardHeader>
            <CardContent>
                <Carousel className="w-full">
                    <CarouselContent>
                        {teams.map((team) => (
                            <CarouselItem key={team.id} className="basis-full">
                                <TeamNextTeam team={team} />
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselNext className="right-2" />
                    <CarouselPrevious className="left-2" />
                </Carousel>
            </CardContent>
        </Card>
    )
}
export default Trailer
