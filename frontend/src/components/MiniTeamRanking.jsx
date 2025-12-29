import { Link, useNavigate } from "react-router-dom"
import { useTopTeam } from "../hooks/useTeam"

const MiniTeamRanking = () => {
    const navigate = useNavigate()
    const { data: { teams: east = [] } = {} } = useTopTeam('east', '2025-26', 3);
    const { data: { teams: west = [] } = {} } = useTopTeam('west', '2025-26', 3);

    if (!east || !west) {
        return null
    }

    return (
        <div className="w-full rounded-2xl bg-white shadow-lg">
            <div>
                <div className="flex justify-around">
                    <div className="flex flex-col items-center">
                        <h3 className="font-bold">EAST</h3>
                        <div>
                            {east.map((seasonStat) => (
                                <div
                                    key={seasonStat.id}
                                    className="flex items-center cursor-pointer hover:bg-gray-100 p-1 rounded"
                                    onClick={() => navigate(`/team/${seasonStat.team.id}`)}
                                >
                                    <img src={seasonStat.team.logoUrl} alt={seasonStat.team.name} className="w-10 h-10" />
                                    <span className="mr-2">{seasonStat.team.name}</span>
                                    <span>{seasonStat.team.wins}-{seasonStat.team.losses}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="w-px bg-gray-300 self-stretch"></div>
                    <div className="flex flex-col items-center">
                        <h3 className="font-bold">WEST</h3>
                        <div>
                            {west.map((seasonStat) => (
                                <div
                                    key={seasonStat.id}
                                    className="flex items-center cursor-pointer hover:bg-gray-100 p-1 rounded"
                                    onClick={() => navigate(`/team/${seasonStat.team.id}`)}
                                >
                                    <img src={seasonStat.team.logoUrl} alt={seasonStat.team.name} className="w-10 h-10" />
                                    <span className="mr-2">{seasonStat.team.name}</span>
                                    <span>{seasonStat.team.wins}-{seasonStat.team.losses}</span>
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