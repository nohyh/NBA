import { useState } from 'react'
import { StarIcon } from "lucide-react"
import { useParams } from 'react-router-dom'
import { Carousel, CarouselContent, CarouselItem ,CarouselNext,CarouselPrevious} from "@/components/ui/carousel"
import { useGameByTeam } from '@/hooks/useGame'
import { useTeamById } from '@/hooks/useTeam'
import{usePlayerByTeam} from '@/hooks/usePlayer'
import GameCard from '@/components/GameCard'
import PlayerCard from '@/components/PlayerCard'
import {useAuth} from "../context/AuthContext"
const Team = () => {
    const { teamId } = useParams()
    const { data: { team } = {} } = useTeamById(teamId);
    const { data: { games } = {} } = useGameByTeam(teamId);
    const { data: { players } = {} } = usePlayerByTeam(teamId);
    const [stared,setStared] = useState(false)
    const {user} = useAuth()
    if (!team||games?.length==0) {
        return null;
    }
    const conference = team.conference=="East" ? "东部" : "西部";
    const today =new Date().setHours(0,0,0,0);
    const todayIndex =games?.findIndex((game) =>{const gameDate =new Date(game.gameDate);
        gameDate.setHours(0,0,0,0);
        return gameDate>=today;
    })??0;
    const startIndex =todayIndex-2;
    return (
        <div className='flex flex-wrap '>
            <div className="flex  w-full h-[300px]  shadow-lg  p-8" style={{backgroundColor:team.primaryColor}}>
                <div>
                    <img className='w-50 h-50' src={team.logoUrl} alt={team.fullName} />
                </div>
                <div className='flex flex-col gap-5 ml-40 mt-5'>
                    <span className='text-5xl font-bold'>{team.fullName}</span>
                    <span className='text-3xl font-semibold'> {conference}第{team.rank}</span>
                    <span className='text-xl font-semibold'>{team.wins}胜{team.losses}负</span>
                </div>
                <div className='flex flex-col gap-5 ml-40 mt-20'>
                    <span className='text-xl font-semibold'>成立年份：{team.yearFounded}</span>
                    <span className='text-xl font-semibold'>总冠军数：{team.championship}</span>
                </div>
                 {!!user?<div  className="flex items-center gap-2 ml-20 ">
                        <StarIcon onClick={()=>setStared(!stared)}  className={stared ? "text-yellow-300" : "text-white  cursor-pointer"} />
                         <span className="text-white font-light"> {stared?'已订阅':'订阅'}</span>
                </div>:null}
                
            </div>
            <div className='flex w-full h-[200px]  shadow-lg  p-8'>
                <Carousel  className='w-full '   opts={{startIndex:todayIndex,
          align: "start",
        }}>
                    <CarouselContent className='w-full'>
                        {games&&games.map((game) => (
                            <CarouselItem key={game.id} className='flex-none w-75 h-full'>
                                <GameCard game={game} />
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
            </div>
            <div className='flex w-full h-[500px]  shadow-lg rounded-2xl overflow-hidden p-5 mt-5'>
                <Carousel className='w-full '>
                    <CarouselContent >
                        {players&&players.map((player) => (
                            <CarouselItem key={player.id} className='flex-none w-90 h-full'>
                                <PlayerCard player={player} />
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                      <div className='flex justify-center gap-20'>
                    <CarouselPrevious className='static translate-y-0 size-20 cursor-pointer' />
                    <CarouselNext className='static translate-y-0 size-20 cursor-pointer' />
                    </div>
                </Carousel>

            </div>
        </div>
    )
}

export default Team