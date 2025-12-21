import {Link} from "react-router-dom"
import {useTopTeam} from "../hooks/useTeam"
const MiniTeamRanking = ()=>{
    const { data: { teams: east=[] } = {} } = useTopTeam('east','2025-26',3);
    const { data: { teams: west=[] } = {} } = useTopTeam('west','2025-26',3);
    if(!east || !west){
        return null
    }
    return(
        <div className="w-full rounded-2xl bg-white shadow-lg" >
            <div >
                <div className="flex justify-around ">
                <div className="flex flex-col  items-center">
                    <h3 className="font-bold">EAST</h3>
                    <div>
                        {east.map((team)=>(
                            <div key={team.id} className="flex items-center">
                                <img src={team.team.logoUrl} alt={team.team.name} className="w-10 h-10" />
                                <span className="mr-2">{team.team.name}</span>
                                <span>{team.team.wins}-{team.team.losses}</span>
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
                                <img src={team.team.logoUrl} alt={team.team.name} className="w-10 h-10" />
                                <span className="mr-2">{team.team.name}</span>
                                <span>{team.team.wins}-{team.team.losses}</span>
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
            </div>
        </div>
    )
} 
export default MiniTeamRanking