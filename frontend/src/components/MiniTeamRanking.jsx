import { Link, useNavigate } from "react-router-dom"
import { useTopTeam } from "../hooks/useTeam"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"

const TeamItem = ({ team, onClick }) => (
    <div
        className="flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-muted/40 cursor-pointer transition-colors"
        onClick={onClick}
    >
        <img
            src={team.team.logoUrl}
            alt={team.team.name}
            className="w-8 h-8 object-contain"
            loading="lazy"
        />
        <span className="flex-1 font-medium text-sm truncate">{team.team.name}</span>
        <span className="text-sm text-muted-foreground">
            {team.team.wins}-{team.team.losses}
        </span>
    </div>
)

const MiniTeamRanking = () => {
    const navigate = useNavigate()
    const { data: { teams: east = [] } = {} } = useTopTeam('east', '2025-26', 3)
    const { data: { teams: west = [] } = {} } = useTopTeam('west', '2025-26', 3)

    if (!east.length && !west.length) return null

    return (
        <Card className="border bg-white/85 shadow-sm">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-base">球队榜</CardTitle>
                    <Button variant="ghost" size="sm" asChild>
                        <Link to="/team-rank" className="text-xs text-muted-foreground">
                            更多 <ChevronRight className="w-4 h-4" />
                        </Link>
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-4">
                    {/* 东部 */}
                    <div>
                        <h4 className="text-xs font-semibold text-muted-foreground mb-2 uppercase">东部</h4>
                        <div className="space-y-1">
                            {east.map((team) => (
                                <TeamItem
                                    key={team.id}
                                    team={team}
                                    onClick={() => navigate(`/team/${team.team.id}`)}
                                />
                            ))}
                        </div>
                    </div>

                    {/* 西部 */}
                    <div>
                        <h4 className="text-xs font-semibold text-muted-foreground mb-2 uppercase">西部</h4>
                        <div className="space-y-1">
                            {west.map((team) => (
                                <TeamItem
                                    key={team.id}
                                    team={team}
                                    onClick={() => navigate(`/team/${team.team.id}`)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default MiniTeamRanking
