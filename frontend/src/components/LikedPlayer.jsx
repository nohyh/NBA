import { useAuth } from "../context/AuthContext"
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "./ui/carousel"
import PlayerCard from "./PlayerCard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const LikedPlayer = () => {
    const {user} = useAuth()
    const players =user?.favoritePlayers
    if(!players?.length){
        return null
    }
    return (
        <Card className="border bg-white/85 shadow-sm">
            <CardHeader className="pb-2">
                <CardTitle className="text-base">我喜欢的球员</CardTitle>
            </CardHeader>
            <CardContent className="relative px-6 pb-6">
                <Carousel className="relative w-full">
                    <CarouselContent>
                        {players.map((player) => (
                            <CarouselItem key={player.id} className="basis-full">
                                <PlayerCard player={player} />
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="left-2" />
                    <CarouselNext className="right-2" />
                </Carousel>
            </CardContent>
        </Card>
    )
}
export default LikedPlayer
