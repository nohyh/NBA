import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useNavigate } from "react-router-dom"
import { useTopPlayer } from "../hooks/usePlayer"
import { ChevronLeft, ChevronRight, Trophy } from "lucide-react"

const SEASONS = ['2025-26', '2024-25', '2023-24', '2022-23', '2021-22']
const SEASON_TYPES = ['Regular Season', 'Playoffs']
const DATA_TYPES = [
    { value: 'pts', label: '得分' },
    { value: 'reb', label: '篮板' },
    { value: 'ast', label: '助攻' },
    { value: 'stl', label: '抢断' },
    { value: 'blk', label: '盖帽' },
    { value: 'fgPct', label: '命中率' },
    { value: 'tppPct', label: '三分率' },
    { value: 'ftPct', label: '罚球率' },
    { value: 'min', label: '时间' },
    { value: 'eff', label: '效率' },
]

const PlayerRank = () => {
    const navigate = useNavigate()
    const [season, setSeason] = useState('2025-26')
    const [seasonType, setSeasonType] = useState('Regular Season')
    const [dataType, setDataType] = useState('pts')
    const [page, setPage] = useState(1)

    const { data: { players = [], totalPlayers = 0 } = {} } = useTopPlayer(season, seasonType, dataType, page, 20)
    const totalPages = Math.ceil(totalPlayers / 20) || 1

    return (
        <div className="space-y-6">
            {/* 筛选器 */}
            <Card className="border bg-white/85 shadow-sm">
                <CardContent className="p-4">
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">赛季:</span>
                            <Select value={season} onValueChange={(v) => { setSeason(v); setPage(1) }}>
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

                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">类型:</span>
                            <Select value={seasonType} onValueChange={(v) => { setSeasonType(v); setPage(1) }}>
                                <SelectTrigger className="w-[140px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {SEASON_TYPES.map((s) => (
                                        <SelectItem key={s} value={s}>{s === 'Regular Season' ? '常规赛' : '季后赛'}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">数据:</span>
                            <Select value={dataType} onValueChange={(v) => { setDataType(v); setPage(1) }}>
                                <SelectTrigger className="w-[100px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {DATA_TYPES.map((d) => (
                                        <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="ml-auto text-sm text-muted-foreground">
                            共 {totalPlayers} 名球员
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* 排行榜 */}
            <Card className="border bg-white/85 shadow-sm">
                <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                        <Trophy className="w-4 h-4" />
                        {DATA_TYPES.find(d => d.value === dataType)?.label || dataType} 排行榜
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Table className="text-xs sm:text-sm">
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-12">#</TableHead>
                                <TableHead>球员</TableHead>
                                <TableHead>球队</TableHead>
                                <TableHead className="text-right">
                                    {DATA_TYPES.find(d => d.value === dataType)?.label || dataType}
                                </TableHead>
                                <TableHead className="text-right">得分</TableHead>
                                <TableHead className="text-right">篮板</TableHead>
                                <TableHead className="text-right">助攻</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {players.map((player, index) => (
                                <TableRow
                                    key={player.id}
                                    className="cursor-pointer hover:bg-muted"
                                    onClick={() => navigate(`/player/${player.player.id}`)}
                                >
                                    <TableCell className="font-medium">
                                        {(page - 1) * 20 + index + 1}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <img
                                                src={player.player.headshotUrl}
                                                alt={player.player.fullName}
                                                className="w-8 h-8 rounded-full object-cover bg-muted"
                                                loading="lazy"
                                            />
                                            <span className="font-medium">{player.player.fullName}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{player.player.team?.abbreviation || 'N/A'}</TableCell>
                                    <TableCell className="text-right font-bold text-primary">
                                        {player[dataType]}
                                    </TableCell>
                                    <TableCell className="text-right">{player.pts}</TableCell>
                                    <TableCell className="text-right">{player.reb}</TableCell>
                                    <TableCell className="text-right">{player.ast}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {/* 分页 */}
                    <div className="flex items-center justify-end gap-2 mt-4">
                        <span className="text-sm text-muted-foreground">
                            第 {page} / {totalPages} 页
                        </span>
                        <Button
                            variant="outline"
                            size="icon"
                            disabled={page <= 1}
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            disabled={page >= totalPages}
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        >
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default PlayerRank
