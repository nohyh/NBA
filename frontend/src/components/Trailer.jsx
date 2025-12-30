import {useAuth} from "../context/AuthContext"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./ui/carousel"
import { useGameByTeam } from "@/hooks/useGame"
import { formatLocalDateYmd } from "../utils/date"
const TeamNextTeam = ({team})=>{
    const {data: {games=[]}={}} = useGameByTeam(team.id)
    const Today =new Date().setHours(0,0,0,0);
    const nextGame = games?.find((game)=>new Date(game.gameDate) >= Today)
    if(!nextGame){
        return null
    }
    return (
        <div className="flex justify-center items-center w-full gap-2">
            <img className="w-12 h-12" src={team.logoUrl} alt={team.name} />
            <span>
                {`${team.fullName} 的下一场比赛：${formatLocalDateYmd(nextGame?.gameDate)}`}
            </span>
        </div>
    )
}
const Trailer = () => {
    const {user} = useAuth()
    const teams = user?.favoriteTeams
    if(!teams){
        return null
    }
    return (
        <div>
            <Carousel className="w-full">
                <CarouselContent>
                {teams.map((team) => (
                    <CarouselItem key={team.id}>
                        <TeamNextTeam team={team} />
                    </CarouselItem>
                ))}
                </CarouselContent>
                <CarouselNext  className="size-10 cursor-pointer"/>
                <CarouselPrevious className="size-10 cursor-pointer"/>
            </Carousel>
        </div>
    )
}
export default Trailer
