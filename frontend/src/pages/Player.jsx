import { useParams } from "react-router-dom"
import { usePlayer } from "../hooks/usePlayer"
const Player = () => {
    const {playerId} = useParams()
    const { data: { player} = {} } = usePlayer(playerId);
    if(!player){
        return <div>Player not found</div>
    }
    return (
        <div>
            <div className="flex w-full h-[500px] rounded-2xl shadow-lg gap-4" style={{backgroundColor:player.team.primaryColor}}>
                {player.fullName}
                <img src={player.team.logoUrl} alt={player.team.fullName} />
                <img src={player.headshotUrl} alt={player.fullName} />
                {player.team.fullName}
                {player.jersey}
                {player.position}
                {player.seasonStats?.[0]?.pts}
                {player.seasonStats?.[0]?.reb}
                {player.seasonStats?.[0]?.ast}
                {player.height}
                {player.weight}
                {player.country}
             </div>

        </div>
    )
}
export default Player
