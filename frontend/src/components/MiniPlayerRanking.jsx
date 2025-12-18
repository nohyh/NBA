import { Card, CardContent } from "@/components/ui/card"
import {Link} from "react-router-dom"
import {useplayerLeaders} from "../hooks/usePlayer"
const PlayerCard =({player,type})=>{
    if(!player){
        return null
    }
    return(
        <Card className="w-full bg-blue-50/70 backdrop-blur-sm " >
            <CardContent>
                <div className="flex justify-center gap-3" >
                    <img src={player.player.headshotUrl} alt={player.player.fullName} className="w-18 h-15" />
                    <span>{player.player.jersey} {player.player.position}</span>
                    <span className="font-sans font-bold text-black tracking-tight text-xl">{player.player.fullName}</span>
                    <div className="font-sans font-bold text-black tracking-tight text-xl">
                    {type==='pts'?(<span> {player.pts} PTS</span>):
                    type==='reb'?(<span> {player.reb} REB</span>):
                    type==='ast'?(<span> {player.ast} AST</span>):null}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
const MiniPlayerRanking=()=>{
    const{data:scorerData} = useplayerLeaders(1,"pts")
    const{data:assistData} = useplayerLeaders(1,"ast")
    const{data:reboundsData} = useplayerLeaders(1,"reb")
    const topScorer =scorerData?.leaders?.[0].leader?.[0]
    const topAssist =assistData?.leaders?.[0].leader?.[0]
    const topRebound =reboundsData?.leaders?.[0].leader?.[0]
     return(
            <Card className="w-full bg-red-50/70 backdrop-blur-sm ">
            <CardContent className="flex flex-col gap-y-5">
            <span className="flex justify-center text-sm font-bold">  得分王</span>
            <PlayerCard player={topScorer} type="pts"/>
            <span className="flex justify-center text-sm font-bold">  助攻王</span>
            <PlayerCard player={topAssist} type="ast"/>
            <span className="flex justify-center text-sm font-bold">  篮板王</span>
            <PlayerCard player={topRebound} type="reb"/>
            <div className="flex justify-center mt-3">
                        <Link to="/player-rank" className="text-blue-500 hover:text-blue-600">
                            View All
                        </Link>
            </div>
            </CardContent>
            </Card>
     )
    
}
export default MiniPlayerRanking