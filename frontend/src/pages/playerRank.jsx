import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { useTopPlayer } from "../hooks/usePlayer"
const PlayerRank = () => {
    const navigate = useNavigate()
    const validSeasons = ['2021-22', '2022-23', '2023-24', '2024-25', '2025-26'];
    const validSeasonTypes = ['Regular Season', 'Playoffs'];
    const validDataTypes = ['min', 'pts', 'reb', 'ast', 'stl', 'blk', 'tov', 'pf', 'fgm', 'fga', 'fgPct', 'fg3m', 'fg3a', 'tppPct', 'ftm', 'fta', 'ftPct', 'oreb', 'dreb', 'eff', 'astTov', 'stlTov'];
    const [season, setSeason] = useState('2025-26');
    const [seasonType, setSeasonType] = useState('Regular Season');
    const [dataType, setDataType] = useState('pts');
    const [page, setPage] = useState(1)
    const { data: { players = [], totalPlayers } = {} } = useTopPlayer(season, seasonType, dataType, page, 20)
    return (
        <>
            <div className="flex w-4/5 h-[160px] items-center rounded-3xl overflow-hidden shadow-xl bg-white mx-auto mt-10  gap-2">
                <div className="flex flex-col ml-5 w-1/4 gap-3 ">
                    Season
                    <Select defaultValue={season} onValueChange={(value) => setSeason(value)}>
                        <SelectTrigger className="w-[250px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {validSeasons.map((season) => (
                                <SelectItem key={season} value={season}>
                                    {season}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex flex-col w-1/4 gap-3">
                    SeasonType
                    <Select defaultValue={seasonType} onValueChange={(value) => setSeasonType(value)}>
                        <SelectTrigger className="w-[250px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {validSeasonTypes.map((seasonType) => (
                                <SelectItem key={seasonType} value={seasonType}>
                                    {seasonType}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex flex-col w-1/4 gap-3">
                    DataType
                    <Select defaultValue={dataType} onValueChange={(value) => setDataType(value)}>
                        <SelectTrigger className="w-[250px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {validDataTypes.map((dataType) => (
                                <SelectItem key={dataType} value={dataType}>
                                    {dataType}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="flex flex-wrap w-4/5 rounded-3xl overflow-hidden shadow-xl bg-white mx-auto mt-10  gap-2">
                <div className="flex w-full h-[100px] ">
                    <div className="flex gap-4 items-center ml-auto">
                        {` return ${totalPlayers} results`}
                        page <Select value={String(page)} onValueChange={(value) => setPage(parseInt(value))}>
                            <SelectTrigger className="w-[80px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {Array.from({ length: Math.ceil(totalPlayers / 20) }, (_, i) => i + 1).map((page) => (
                                    <SelectItem key={page} value={String(page)}>
                                        {page}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        of {Math.ceil(totalPlayers / 20)}
                        <Button onClick={() => setPage(prev => Math.max(1, prev - 1))}>{'<'}</Button>
                        <Button onClick={() => setPage(prev => Math.min(Math.ceil(totalPlayers / 20), prev + 1))}>{'>'}</Button>
                    </div>
                </div>
                <div className="flex  flex-wrap w-full items-center  gap-4">
                    <div className="flex w-full">
                        <div className="flex gap-4 text-xs font-semibold">
                            <span className="w-[140px]">PLAYER</span>
                            <span className="w-[25px]">TEAM</span>
                            {validDataTypes.map((dataType) => (
                                <span className="w-[25px]" key={dataType}>{dataType}</span>
                            ))}
                        </div>
                    </div>
                    {players && players.map((player) => (
                        <div key={player.id} className="flex w-full cursor-pointer hover:bg-gray-100 p-1 rounded" onClick={() => navigate(`/player/${player.player.id}`)}>
                            <div className="flex gap-4 text-xs divide-y divide-gray-200">
                                <span className="w-[140px]">{player.player.fullName}</span>
                                <span className="w-[25px]">{player.player.team?.abbreviation || 'N/A'}</span>
                                {validDataTypes.map((dataType) => (
                                    <span className="w-[25px]" key={dataType}>{player[dataType]}</span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </>
    )
}
export default PlayerRank