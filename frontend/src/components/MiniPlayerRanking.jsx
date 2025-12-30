import { Link, useNavigate } from "react-router-dom"
import { useplayerLeaders } from "../hooks/usePlayer"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"

const PlayerItem = ({ player, type }) => {
    const navigate = useNavigate()

    if (!player) return null

    const getLabel = () => {
        switch (type) {
            case 'pts': return '得分王'
            case 'reb': return '篮板王'
            case 'ast': return '助攻王'
            default: return ''
        }
    }

    const getValue = () => {
        switch (type) {
            case 'pts': return `${player.pts} PTS`
            case 'reb': return `${player.reb} REB`
            case 'ast': return `${player.ast} AST`
            default: return ''
        }
    }

    return (
        <div
            className="flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-muted/40 cursor-pointer transition-colors"
            onClick={() => navigate(`/player/${player.player.id}`)}
        >
            <img
                src={player.player.headshotUrl}
                alt={player.player.fullName}
                className="w-12 h-12 rounded-full object-cover bg-muted"
                loading="lazy"
            />
            <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">{getLabel()}</p>
                <p className="font-medium truncate">{player.player.fullName}</p>
            </div>
            <div className="text-right">
                <p className="font-bold text-primary">{getValue()}</p>
            </div>
        </div>
    )
}

const MiniPlayerRanking = () => {
    const { data: scorerData } = useplayerLeaders(1, "pts")
    const { data: assistData } = useplayerLeaders(1, "ast")
    const { data: reboundsData } = useplayerLeaders(1, "reb")

    const topScorer = scorerData?.leaders?.[0]?.leader?.[0]
    const topAssist = assistData?.leaders?.[0]?.leader?.[0]
    const topRebound = reboundsData?.leaders?.[0]?.leader?.[0]

    return (
        <Card className="border bg-white/85 shadow-sm">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-base">球员榜</CardTitle>
                    <Button variant="ghost" size="sm" asChild>
                        <Link to="/player-rank" className="text-xs text-muted-foreground">
                            更多 <ChevronRight className="w-4 h-4" />
                        </Link>
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-1">
                <PlayerItem player={topScorer} type="pts" />
                <PlayerItem player={topAssist} type="ast" />
                <PlayerItem player={topRebound} type="reb" />
            </CardContent>
        </Card>
    )
}

export default MiniPlayerRanking
