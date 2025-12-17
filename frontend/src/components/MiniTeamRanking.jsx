import { Card, CardContent } from "@/components/ui/card"
import {Link} from "react-router-dom"
const MiniTeamRanking = ({teams})=>{
    if(!teams){
        return null
    }
    const {east,west} = teams
    return(
        <Card className="w-full bg-blue-50/70 backdrop-blur-sm" >
            <CardContent >
                <div className="flex justify-around ">
                <div className="flex flex-col  items-center">
                    <h3 className="font-bold">EAST</h3>
                    <div>
                        {east.map((team)=>(
                            <div key={team.id} className="flex items-center">
                                <img src={team.logoUrl} alt={team.name} className="w-10 h-10" />
                                <span className="mr-2">{team.name}</span>
                                <span>{team.wins}-{team.losses}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="w-px bg-gray-300 self-stretch"></div>
                <div className="flex flex-col  items-center">
                    <h3 className="font-bold">WEST</h3>
                    <div>
                        {west.map((team)=>(
                            <div key={team.id} className="flex items-center">
                                <img src={team.logoUrl} alt={team.name} className="w-10 h-10" />
                                <span className="mr-2">{team.name}</span>
                                <span>{team.wins}-{team.losses}</span>
                            </div>
                        ))}
                    </div>
                </div>
                </div>
                <div className="flex justify-center mt-3">
                        <Link to="/team-rank" className="text-blue-500 hover:text-blue-600">
                            View All
                        </Link>
                </div>
            </CardContent>
        </Card>
    )
} 
export default MiniTeamRanking