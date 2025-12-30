import { useParams } from "react-router-dom"
import { useGameDetail } from "../hooks/useGame"
import { GameCardPlus } from "@/components/GameCard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const Game = () => {
  const { gameId } = useParams()
  const { data: { game, homePlayers = [], awayPlayers = [] } = {} } = useGameDetail(gameId)

  if (!game) {
    return (
      <div className="flex h-[60vh] items-center justify-center text-muted-foreground">
        暂无比赛数据
      </div>
    )
  }

  const quarterLabels = ["Q1", "Q2", "Q3", "Q4", "总分"]
  const scoreRows = [
    {
      name: game.homeTeam?.fullName || "主队",
      scores: [game.homeQ1, game.homeQ2, game.homeQ3, game.homeQ4, game.homeTeamScore],
    },
    {
      name: game.awayTeam?.fullName || "客队",
      scores: [game.awayQ1, game.awayQ2, game.awayQ3, game.awayQ4, game.awayTeamScore],
    },
  ]

  const renderPlayerRows = (players) => (
    players.map((player) => (
      <TableRow key={player.id}>
        <TableCell className="font-medium">{player.player.fullName}</TableCell>
        <TableCell className="text-right">{player.min}</TableCell>
        <TableCell className="text-right font-semibold text-primary">{player.pts}</TableCell>
        <TableCell className="text-right">{player.reb}</TableCell>
        <TableCell className="text-right">{player.ast}</TableCell>
        <TableCell className="text-right">{player.stl}</TableCell>
        <TableCell className="text-right">{player.blk}</TableCell>
        <TableCell className="text-right">{player.tov}</TableCell>
      </TableRow>
    ))
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-center">
        <GameCardPlus game={game} />
      </div>

      <Card className="border bg-white/85 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">单节得分</CardTitle>
        </CardHeader>
        <CardContent>
          <Table className="text-xs sm:text-sm">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">球队</TableHead>
                {quarterLabels.map((label) => (
                  <TableHead key={label} className="text-right">{label}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {scoreRows.map((row) => (
                <TableRow key={row.name}>
                  <TableCell className="font-medium">{row.name}</TableCell>
                  {row.scores.map((score, index) => (
                    <TableCell key={`${row.name}-${index}`} className="text-right">
                      {score ?? "-"}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="border bg-white/85 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{game.homeTeam?.fullName || "主队"} 数据</CardTitle>
          </CardHeader>
          <CardContent>
            {homePlayers.length ? (
              <Table className="text-xs sm:text-sm">
                <TableHeader>
                  <TableRow>
                    <TableHead>球员</TableHead>
                    <TableHead className="text-right">MIN</TableHead>
                    <TableHead className="text-right">PTS</TableHead>
                    <TableHead className="text-right">REB</TableHead>
                    <TableHead className="text-right">AST</TableHead>
                    <TableHead className="text-right">STL</TableHead>
                    <TableHead className="text-right">BLK</TableHead>
                    <TableHead className="text-right">TOV</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>{renderPlayerRows(homePlayers)}</TableBody>
              </Table>
            ) : (
              <div className="py-10 text-center text-sm text-muted-foreground">暂无球员数据</div>
            )}
          </CardContent>
        </Card>

        <Card className="border bg-white/85 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{game.awayTeam?.fullName || "客队"} 数据</CardTitle>
          </CardHeader>
          <CardContent>
            {awayPlayers.length ? (
              <Table className="text-xs sm:text-sm">
                <TableHeader>
                  <TableRow>
                    <TableHead>球员</TableHead>
                    <TableHead className="text-right">MIN</TableHead>
                    <TableHead className="text-right">PTS</TableHead>
                    <TableHead className="text-right">REB</TableHead>
                    <TableHead className="text-right">AST</TableHead>
                    <TableHead className="text-right">STL</TableHead>
                    <TableHead className="text-right">BLK</TableHead>
                    <TableHead className="text-right">TOV</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>{renderPlayerRows(awayPlayers)}</TableBody>
              </Table>
            ) : (
              <div className="py-10 text-center text-sm text-muted-foreground">暂无球员数据</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Game
