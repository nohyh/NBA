import {useAuth} from "../context/AuthContext"
import { Carousel, CarouselContent, CarouselItem,CarouselPrevious,CarouselNext } from "./ui/carousel"
import PlayerCard from "./PlayerCard"

const LikedPlayer = () => {
    const {user} = useAuth()
    const players =user?.favoritePlayers
    if(!players){
        return null
    }
    return (
        <div className=" w-full">
            <h2 className=" bg-green-500 w-full">我喜欢的球员</h2>
            <div className="relative px-10">
            <Carousel className='relative w-full'>
                <CarouselContent>
                    {players?.map((player) => (
                        <CarouselItem key={player.id}>
                            <PlayerCard player={player}/>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                 <div className="flex justify-center gap-4 mt-2">
       <CarouselPrevious className= "size-10 cursor-pointer" style={{left: '5px', right: 'auto'}} />
       <CarouselNext className= "size-10 cursor-pointer" style={{right: '60px', left: 'auto'}} />
    </div>
            </Carousel>
            </div>
        </div>
    )
}
export default LikedPlayer