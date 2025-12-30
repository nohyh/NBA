import { useTopTeam } from "../hooks/useTeam"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState } from 'react'
import { Trophy, TrendingUp } from "lucide-react"

const SEASONS = ['2024-25', '2023-24', '2022-23', '2021-22']
const STAT_TYPES = [
  { value: 'pts', label: '得分' },
  { value: 'oppPts', label: '失分' },
  { value: 'reb', label: '篮板' },
  { value: 'ast', label: '助攻' },
  { value: 'offRating', label: '进攻效率' },
  { value: 'defRating', label: '防守效率' },
]

const ConferenceTable = ({ teams, navigate }) => (
  <Table className="text-xs sm:text-sm">
    <TableHeader>
      <TableRow>
        <TableHead className="w-12">#</TableHead>
        <TableHead>球队</TableHead>
        <TableHead className="text-right">战绩</TableHead>
        <TableHead className="text-right">胜率</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {teams.map((item, index) => (
        <TableRow
          key={item.id}
          className="cursor-pointer hover:bg-muted"
          onClick={() => navigate(`/team/${item.team?.id || item.id}`)}
        >
          <TableCell className="font-medium">{index + 1}</TableCell>
          <TableCell>
            <div className="flex items-center gap-2">
              <img
                src={item.team?.logoUrl || item.logoUrl}
                alt={item.team?.name || item.name}
                className="w-8 h-8 object-contain"
                loading="lazy"
              />
              <span className="font-medium">{item.team?.name || item.name}</span>
            </div>
          </TableCell>
          <TableCell className="text-right">
            {item.wins}-{item.losses}
          </TableCell>
          <TableCell className="text-right font-bold">
            {(item.winRate * 100).toFixed(1)}%
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
)

const StatTable = ({ teams, statType, navigate }) => (
  <Table className="text-xs sm:text-sm">
    <TableHeader>
      <TableRow>
        <TableHead className="w-12">#</TableHead>
        <TableHead>球队</TableHead>
        <TableHead className="text-right">
          {STAT_TYPES.find(s => s.value === statType)?.label}
        </TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {teams.map((item, index) => (
        <TableRow
          key={item.id}
          className="cursor-pointer hover:bg-muted"
          onClick={() => navigate(`/team/${item.team?.id || item.id}`)}
        >
          <TableCell className="font-medium">{index + 1}</TableCell>
          <TableCell>
            <div className="flex items-center gap-2">
              <img
                src={item.team?.logoUrl || item.logoUrl}
                alt={item.team?.name || item.name}
                className="w-8 h-8 object-contain"
                loading="lazy"
              />
              <span className="font-medium">{item.team?.name || item.name}</span>
            </div>
          </TableCell>
          <TableCell className="text-right font-bold text-primary">
            {item[statType]}
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
)

const TeamRank = () => {
  const navigate = useNavigate()
  const [season, setSeason] = useState('2024-25')
  const [statType, setStatType] = useState('pts')

  const { data: { teams: east = [] } = {} } = useTopTeam('east', season)
  const { data: { teams: west = [] } = {} } = useTopTeam('west', season)
  const { data: { teams: statTeams = [] } = {} } = useTopTeam(statType, season)

  return (
    <div className="space-y-6">
      {/* 赛季选择器 */}
      <Card className="border bg-white/85 shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">赛季:</span>
            <Select value={season} onValueChange={setSeason}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SEASONS.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* 战绩排名 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border bg-white/85 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              东部战绩
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ConferenceTable teams={east} navigate={navigate} />
          </CardContent>
        </Card>

        <Card className="border bg-white/85 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              西部战绩
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ConferenceTable teams={west} navigate={navigate} />
          </CardContent>
        </Card>
      </div>

      {/* 数据排名 */}
      <Card className="border bg-white/85 shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              数据排名
            </CardTitle>
            <Select value={statType} onValueChange={setStatType}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STAT_TYPES.map((s) => (
                  <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <StatTable teams={statTeams} statType={statType} navigate={navigate} />
        </CardContent>
      </Card>
    </div>
  )
}

export default TeamRank
