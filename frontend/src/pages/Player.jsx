import { useParams, useNavigate } from "react-router-dom"
import { usePlayer } from "../hooks/usePlayer"
import { StarIcon } from "lucide-react"
import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import { ToCm, ToKg } from "../utils/transform"
const Player = () => {
    const { playerId } = useParams()
    const { data: { player } = {} } = usePlayer(playerId);
    const [stared, setStared] = useState(false)
    const { user } = useAuth()
    const navigate = useNavigate()
    if (!player || !player.seasonStats?.length) {
        return <div>Player not found</div>
    }
    return (
        <div className="flex flex-col">
            <div className="flex flex-wrap w-full h-[550px]  shadow-lg" >
                <div className="flex h-[400px] w-full " style={{ backgroundColor: player.team.primaryColor }}>
                    <img className="w-36 h-36 ml-20 mt-5 cursor-pointer hover:opacity-80 transition-opacity" src={player.team.logoUrl} alt={player.team.fullName} onClick={() => navigate(`/team/${player.team.id}`)} />
                    <img className="w-90 h-65 mt-auto " src={player.headshotUrl} alt={player.fullName} />
                    <p className="flex flex-col text-white justify-center">
                        <span> {`${player.team.fullName}|#${player.jersey}|${player.position}`}</span>
                        <span className="text-5xl font-bold"> {player.firstName}</span>
                        <span className="text-5xl font-bold"> {player.lastName}</span>
                    </p>
                    {!!user ? <div className="flex items-center gap-2 ml-80 ">
                        <StarIcon onClick={() => setStared(!stared)} className={stared ? "text-yellow-300" : "text-white  cursor-pointer"} />
                        <span className="text-white font-light"> {stared ? '已订阅' : '订阅'}</span>
                    </div> : null}
                </div>
                <div className="flex w-full h-[150px] shadow-lg bg-black font-extrabold ">
                    <div className="flex flex-col text-white justify-center items-center w-1/6">
                        <span className="text-xm"> 场均得分</span>
                        <span className="text-2xl">{player.seasonStats[0].pts}</span>
                    </div>
                    <div className="flex flex-col text-white justify-center items-center w-1/6">
                        <span className="text-xm"> 场均篮板</span>
                        <span className="text-2xl">{player.seasonStats[0].reb}</span>
                    </div>
                    <div className="flex flex-col text-white justify-center items-center w-1/6">
                        <span className="text-xm"> 场均助攻</span>
                        <span className="text-2xl">{player.seasonStats[0].ast}</span>
                    </div>
                    <div className="flex flex-col text-white justify-center items-center w-1/6 ">
                        <span className="text-xm"> 身高</span>
                        <span className="text-2xl">{ToCm(player.height)}CM</span>
                    </div>
                    <div className="flex flex-col text-white justify-center items-center w-1/6 ">
                        <span className="text-xm"> 体重</span>
                        <span className="text-2xl">{ToKg(player.weight)}KG</span>
                    </div>
                    <div className="flex flex-col text-white justify-center items-center w-1/6 ">
                        <span className="text-xm"> 国家</span>
                        <span className="text-2xl">{player.country}</span>
                    </div>
                </div>
            </div>
            <div className="flex flex-wrap rounded-2xl shadow-lg overflow-hidden p-5">
                <p className="text-xl font-bold w-full"> 最近五场比赛</p>
                <div className="flex flex-col w-full">
                    <div className="flex gap-3 bg-gray-200">
                        <span className="w-25">比赛时间</span>
                        <span className="w-25">对阵</span>
                        <span className="w-25">胜负</span>
                        <span className="w-25">上场时间</span>
                        <span className="w-25">得分</span>
                        <span className="w-25">篮板</span>
                        <span className="w-25">助攻</span>
                        <span className="w-25">抢断</span>
                        <span className="w-25">盖帽</span>
                        <span className="w-25">失误</span>
                    </div>
                    {player.gameLogs.map((game) => (
                        <div key={game.id} className="flex gap-3 divide-y divide-gray-200">
                            <span className="w-25">{(game.gameDate).slice(0, 10)}</span>
                            <span className=" flex w-25">{game.matchup}</span>
                            <span className="w-25">{game.wl}</span>
                            <span className="w-25">{game.min}</span>
                            <span className="w-25">{game.pts}</span>
                            <span className="w-25">{game.reb}</span>
                            <span className="w-25">{game.ast}</span>
                            <span className="w-25">{game.stl}</span>
                            <span className="w-25">{game.blk}</span>
                            <span className="w-25">{game.tov}</span>
                        </div>
                    ))}
                </div>
            </div>

        </div>

    )
}
export default Player
