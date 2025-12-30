import { useParams, useNavigate } from "react-router-dom"
import { usePlayer } from "../hooks/usePlayer"
import { StarIcon } from "lucide-react"
import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import { ToCm, ToKg } from "../utils/transform"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const Player = () => {
  const { playerId } = useParams()
  const navigate = useNavigate()
  const { data: { player } = {} } = usePlayer(playerId)
  const { user, favoritePlayer, unfavoritePlayer } = useAuth()
  const [starred, setStarred] = useState(false)

  useEffect(() => {
    if (user?.favoritePlayers) {
      setStarred(user.favoritePlayers.some((p) => p.id === parseInt(playerId)))
    }
  }, [user, playerId])

  if (!player) {
    return (
      <div className="flex h-[60vh] items-center justify-center text-muted-foreground">
        暂无球员数据
      </div>
    )
  }

  const season = player.seasonStats?.[0]
  const statCards = [
    { label: "场均得分", value: season?.pts ?? "-" },
    { label: "场均篮板", value: season?.reb ?? "-" },
    { label: "场均助攻", value: season?.ast ?? "-" },
    { label: "身高", value: player.height ? `${ToCm(player.height)} CM` : "-" },
    { label: "体重", value: player.weight ? `${ToKg(player.weight)} KG` : "-" },
    { label: "国家", value: player.country || "-" },
  ]
  const recentGames = player.gameLogs?.slice(0, 5) || []

  const handleStar = async () => {
    const newStarred = !starred
    setStarred(newStarred)
    try {
      if (newStarred) {
        await favoritePlayer(playerId)
      } else {
        await unfavoritePlayer(playerId)
      }
    } catch (error) {
      setStarred(!newStarred)
      console.log(error)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border bg-white/85 shadow-sm">
        <CardContent className="p-6">
          <div className="grid gap-6 lg:grid-cols-[220px_1fr_auto] lg:items-center">
            <div
              className="flex items-center justify-center rounded-2xl p-4 shadow-sm"
              style={{ backgroundColor: player.team?.primaryColor ? `${player.team.primaryColor}20` : undefined }}
              role="button"
              tabIndex={0}
              onClick={() => player.team?.id && navigate(`/team/${player.team.id}`)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && player.team?.id) {
                  navigate(`/team/${player.team.id}`)
                }
              }}
            >
              <img className="h-20 w-20 object-contain" src={player.team?.logoUrl} alt={player.team?.fullName} />
            </div>

            <div className="space-y-3">
              <div className="text-sm text-muted-foreground">{player.team?.fullName}</div>
              <h1 className="text-3xl font-bold">{player.firstName} {player.lastName}</h1>
              <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                <Badge variant="outline">#{player.jersey || "-"}</Badge>
                <Badge variant="outline">{player.position || "未知位置"}</Badge>
                <Badge variant="outline">{player.country || "未知国家"}</Badge>
              </div>
            </div>

            <div className="flex flex-col items-end gap-3">
              <div className="rounded-2xl bg-muted/40 p-3">
                <img className="h-44 w-32 object-contain" src={player.headshotUrl} alt={player.fullName} />
              </div>
              {!!user && (
                <Button
                  variant={starred ? "secondary" : "outline"}
                  size="sm"
                  className="gap-2"
                  onClick={handleStar}
                >
                  <StarIcon className={`h-4 w-4 ${starred ? "text-yellow-500" : ""}`} />
                  {starred ? "已订阅" : "订阅"}
                </Button>
              )}
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {statCards.map((item) => (
              <div key={item.label} className="rounded-xl border bg-muted/40 px-4 py-3">
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className="mt-1 text-lg font-semibold">{item.value}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border bg-white/85 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">最近五场比赛</CardTitle>
        </CardHeader>
        <CardContent>
          {recentGames.length ? (
            <Table className="text-xs sm:text-sm">
              <TableHeader>
                <TableRow>
                  <TableHead>比赛时间</TableHead>
                  <TableHead>对阵</TableHead>
                  <TableHead>结果</TableHead>
                  <TableHead className="text-right">MIN</TableHead>
                  <TableHead className="text-right">PTS</TableHead>
                  <TableHead className="text-right">REB</TableHead>
                  <TableHead className="text-right">AST</TableHead>
                  <TableHead className="text-right">STL</TableHead>
                  <TableHead className="text-right">BLK</TableHead>
                  <TableHead className="text-right">TOV</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentGames.map((game) => (
                  <TableRow key={game.id}>
                    <TableCell>{game.gameDate?.slice(0, 10)}</TableCell>
                    <TableCell>{game.matchup}</TableCell>
                    <TableCell>
                      <Badge variant={game.wl === "W" ? "secondary" : "destructive"}>
                        {game.wl === "W" ? "胜" : "负"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">{game.min}</TableCell>
                    <TableCell className="text-right font-semibold text-primary">{game.pts}</TableCell>
                    <TableCell className="text-right">{game.reb}</TableCell>
                    <TableCell className="text-right">{game.ast}</TableCell>
                    <TableCell className="text-right">{game.stl}</TableCell>
                    <TableCell className="text-right">{game.blk}</TableCell>
                    <TableCell className="text-right">{game.tov}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="py-10 text-center text-sm text-muted-foreground">暂无比赛数据</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default Player
