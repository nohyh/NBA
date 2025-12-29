import { useParams } from "react-router-dom"
import {useGameDetail} from "../hooks/useGame"
import {GameCardPlus} from "@/components/GameCard";
const Game=()=>{
    const {gameId} =useParams()
    const { data: { game,homePlayers,awayPlayers } = {} } = useGameDetail(gameId);
    if(!game||!homePlayers||!awayPlayers){
        return <div>no data</div>
    }
    return (
        <div>
            <div className="flex flex-wrap w-4/5   rounded-3xl overflow-hidden shadow-xl bg-white mx-auto mt-10  gap-2">
                <div className="flex w-full justify-center">
                <GameCardPlus className='w-full' game={game}/>
                </div>
                <div className="flex flex-col w-full justify-center p-5 gap-2">
                    <div className="flex w-full bg-gray-200">
                        <span className="w-1/6">球队</span>
                        <span className="w-1/6">第一节</span>
                        <span className="w-1/6">第二节</span>
                        <span className="w-1/6">第三节</span>
                        <span className="w-1/6">第四节</span>
                        <span className="w-1/6"> 总分</span>
                    </div>
                    <div className="flex flex-col w-full justify-center gap-2">
                       <div className="flex">
                         <span className="w-1/6"> {game.homeTeam.fullName}</span>
                         <span className="w-1/6">{game.homeQ1}</span>
                         <span className="w-1/6">{game.homeQ2}</span>
                         <span className="w-1/6">{game.homeQ3}</span>
                         <span className="w-1/6">{game.homeQ4}</span>
                         <span className="w-1/6">{game.homeTeamScore}</span>
                       </div>
                       <div className="flex">
                         <span className="w-1/6"> {game.awayTeam.fullName}</span>
                         <span className="w-1/6">{game.awayQ1}</span>
                         <span className="w-1/6">{game.awayQ2}</span>
                         <span className="w-1/6">{game.awayQ3}</span>
                         <span className="w-1/6">{game.awayQ4}</span>
                         <span className="w-1/6">{game.awayTeamScore}</span>
                       </div>
                    </div>
                </div>
                 <div className="flex flex-wrap p-5">
                    <span className="w-full font-bold">{game.homeTeam.fullName}</span>     
                    <div className="flex flex-col w-full">
                        <div className="flex bg-gray-200">
                            <span className="w-50">球员</span>
                            <span className="w-25">时间</span>
                            <span className="w-25">得分</span>
                            <span className="w-25">篮板</span>
                            <span className="w-25">助攻</span>
                            <span className="w-25">抢断</span>
                            <span className="w-25"> 盖帽</span>
                            <span className="w-25">失误</span>
                        </div>
                        {homePlayers&&homePlayers.map((player)=>(
                            <div key={player.id} className="flex   divide-y divide-gray-200">
                                <span className="w-50">{player.player.fullName}</span>
                                <span className="w-25">{player.min}</span>
                                <span className="w-25">{player.pts}</span>
                                <span className="w-25">{player.reb}</span>
                                <span className="w-25">{player.ast}</span>
                                <span className="w-25">{player.stl}</span>
                                <span className="w-25">{player.blk}</span>
                                <span className="w-25">{player.tov}</span>
                            </div>
                        ))}
                    </div>
                
                </div>
                <div className="flex flex-wrap p-5">
                    <span className="w-full font-bold">{game.awayTeam.fullName}</span>     
                    <div className="flex flex-col w-full ">
                        <div className="flex bg-gray-200">
                            <span className="w-50">球员</span>
                            <span className="w-25">时间</span>
                            <span className="w-25">得分</span>
                            <span className="w-25">篮板</span>
                            <span className="w-25">助攻</span>
                            <span className="w-25">抢断</span>
                            <span className="w-25"> 盖帽</span>
                            <span className="w-25">失误</span>
                        </div>
                        {awayPlayers&&awayPlayers.map((player)=>(
                            <div key={player.id} className="flex w-full divide-y divide-gray-200">
                                <span className="w-50">{player.player.fullName}</span>
                                <span className="w-25">{player.min}</span>
                                <span className="w-25">{player.pts}</span>
                                <span className="w-25">{player.reb}</span>
                                <span className="w-25">{player.ast}</span>
                                <span className="w-25">{player.stl}</span>
                                <span className="w-25">{player.blk}</span>
                                <span className="w-25">{player.tov}</span>
                            </div>
                        ))} 
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Game 