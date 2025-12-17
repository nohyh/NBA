import { Card, CardContent } from "@/components/ui/card"
import {Link} from "react-router-dom"

const PlayerCard =({player})=>{
    if(!player){
        return null
    }
    return(
        <Card className="w-full bg-blue-50/70 backdrop-blur-sm" >
            <CardContent>
                <div className="flex justify-center gap-4" >
                    <img src={player.headshotUrl} alt={player.name} className="w-10 h-10" />
                    <span>{player.team.name} {player.number}  {player.position}</span>
                    <span className="mr-2">{player.name}</span>
                    <span>{player.points} {player.rebounds} {player.assists}</span>

                </div>
            </CardContent>
        </Card>
    )
}
export default PlayerCard