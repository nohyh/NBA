import {Link} from "react-router-dom"
import {useplayerLeaders} from "../hooks/usePlayer"
const PlayerCard =({player,type})=>{
    if(!player){
        return null
    }
    return(
        <div className=" relative w-[300px] h-[200px] overflow-hidden rounded-3xl bg-white shadow-xl " >
            <img src={player.player.headshotUrl} alt={player.player.fullName} className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/70 to-transparent"/>
            <div className="absolute bottom-6 left-6 right-6">
                    <p className="text-xl text-gray-400"> {type==='pts'?'得分王':type==='reb'?'篮板王':'助攻王'}</p>
                    <span className="text-xl font-bold text-gray-900">{player.player.fullName}</span>
                    <div className="mt-3 flex gap-4 text-lg font-semibold text-gray-900">
                    {type==='pts'?(<span> {player.pts} PTS</span>):
                    type==='reb'?(<span> {player.reb} REB</span>):
                    type==='ast'?(<span> {player.ast} AST</span>):null}
                    </div>
                </div>
        </div>
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
            <div className="flex">
            <div className="flex flex-col gap-y-5">
            <div className="flex gap-x-5 items-center">
            <PlayerCard player={topScorer} type="pts"/>
                    <Link to="/player-rank" className="text-blue-500 hover:text-blue-600">
                        More
                    </Link>
            </div>
            <div className="flex gap-x-5 items-center">
            <PlayerCard player={topAssist} type="ast"/>
            <Link to="/player-rank" className="text-blue-500 hover:text-blue-600">
                        More
                    </Link>
            </div>
            <div className="flex gap-x-5 items-center">
            <PlayerCard player={topRebound} type="reb"/>
            <Link to="/player-rank" className="text-blue-500 hover:text-blue-600">
                        More
                    </Link>
            </div>
            </div>
            </div>
     )
    
}
export default MiniPlayerRanking