import { useNavigate } from "react-router-dom"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { formatLocalDateMd } from "../utils/date"

const GameCard = ({ game, size = "default" }) => {
  const navigate = useNavigate()
  const isCompact = size === "compact"

  const getStatusColor = () => {
    if (game.status === 'Final') return 'secondary'
    if (game.status.includes('Q')) return 'destructive'
    return 'default'
  }

  return (
    <Card
      className={cn(
        "group flex flex-col cursor-pointer border bg-white/85 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg",
        isCompact ? "min-h-[120px] p-4" : "min-h-[140px] p-5 sm:p-6"
      )}
      onClick={() => navigate(`/game/${game.id}`)}
    >
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{formatLocalDateMd(game.gameDate)}</span>
        <Badge variant={getStatusColor()} className="capitalize">
          {game.status}
        </Badge>
      </div>

      <div className={cn(isCompact ? "mt-2.5" : "mt-3")}>
        <div className={cn("grid grid-cols-[1fr_auto_1fr] items-center", isCompact ? "gap-2.5" : "gap-4")}>
          <div className={cn("flex min-w-0 items-center", isCompact ? "gap-1.5" : "gap-2")}>
            <img
              src={game.homeTeam.logoUrl}
              alt={game.homeTeam.abbreviation}
              className={cn(
                "rounded-full bg-muted/60 p-1 object-contain",
                isCompact ? "h-8 w-8" : "h-9 w-9"
              )}
              loading="lazy"
            />
            <span className={cn("font-semibold", isCompact ? "text-xs" : "text-sm")}>
              {game.homeTeam.abbreviation}
            </span>
          </div>

          <div
            className={cn(
              "flex items-center gap-2 rounded-full bg-muted font-semibold tabular-nums",
              isCompact ? "px-2.5 py-0.5 text-xs" : "px-3.5 py-1 text-sm"
            )}
          >
            <span>{game.homeTeamScore ?? "-"}</span>
            <span className="text-muted-foreground">-</span>
            <span>{game.awayTeamScore ?? "-"}</span>
          </div>

          <div className={cn("flex min-w-0 items-center justify-end", isCompact ? "gap-1.5" : "gap-2")}>
            <span className={cn("font-semibold", isCompact ? "text-xs" : "text-sm")}>
              {game.awayTeam.abbreviation}
            </span>
            <img
              src={game.awayTeam.logoUrl}
              alt={game.awayTeam.abbreviation}
              className={cn(
                "rounded-full bg-muted/60 p-1 object-contain",
                isCompact ? "h-8 w-8" : "h-9 w-9"
              )}
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </Card>
  )
}

const GameCardPlus = ({ game }) => {
  const navigate = useNavigate()

  return (
    <Card
      className="w-full max-w-2xl border bg-white/85 p-6 shadow-sm transition-all hover:shadow-lg"
      onClick={() => navigate(`/game/${game.id}`)}
    >
      <div className="mb-6 flex items-center justify-between">
        <Badge variant="outline">NBA 常规赛</Badge>
        <p className="text-xs text-muted-foreground">{game.gameDate?.slice(0, 10)}</p>
      </div>

      <div className="flex items-center justify-between">
        {/* 主队 */}
        <div className="flex flex-col items-center gap-2">
          <img
            src={game.homeTeam.logoUrl}
            alt={game.homeTeam.abbreviation}
            className="w-16 h-16 object-contain"
          />
          <span className="font-bold">{game.homeTeam.abbreviation}</span>
          <Badge variant="secondary">主场</Badge>
        </div>

        {/* 比分 */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-4">
            <span className="text-3xl font-bold">{game.homeTeamScore ?? '-'}</span>
            <span className="text-xl text-muted-foreground">-</span>
            <span className="text-3xl font-bold">{game.awayTeamScore ?? '-'}</span>
          </div>
          <Badge variant={game.status === "Final" ? "secondary" : "destructive"}>
            {game.status}
          </Badge>
        </div>

        {/* 客队 */}
        <div className="flex flex-col items-center gap-2">
          <img
            src={game.awayTeam.logoUrl}
            alt={game.awayTeam.abbreviation}
            className="w-16 h-16 object-contain"
          />
          <span className="font-bold">{game.awayTeam.abbreviation}</span>
          <Badge variant="outline">客场</Badge>
        </div>
      </div>
    </Card>
  )
}

export { GameCardPlus, GameCard }
