import { useState, useEffect } from 'react'
import { StarIcon } from "lucide-react"
import { useParams } from 'react-router-dom'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { useGameByTeam } from '@/hooks/useGame'
import { useTeamById } from '@/hooks/useTeam'
import { usePlayerByTeam } from '@/hooks/usePlayer'
import { GameCard } from '@/components/GameCard'
import PlayerCard from '@/components/PlayerCard'
import { useAuth } from "../context/AuthContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const Team = () => {
    const { teamId } = useParams()
    const { data: { team } = {} } = useTeamById(teamId)
    const { data: { games } = {} } = useGameByTeam(teamId)
    const { data: { players } = {} } = usePlayerByTeam(teamId)
    const { user, favoriteTeam, unfavoriteTeam } = useAuth()
    const [stared, setStared] = useState(user?.favoriteTeams?.some((t) => t.id === parseInt(teamId)))

    useEffect(() => {
        if (user?.favoriteTeams) {
            setStared(user.favoriteTeams.some((t) => t.id === parseInt(teamId)))
        }
    }, [user, teamId])

    if (!team) {
        return <div className="flex justify-center items-center h-[60vh] text-muted-foreground">加载中...</div>
    }

    const conference = team.conference === "East" ? "东部" : "西部"
    const today = new Date().setHours(0, 0, 0, 0)
    const todayIndex = Math.max(0, games?.findIndex((game) => {
        const gameDate = new Date(game.gameDate)
        gameDate.setHours(0, 0, 0, 0)
        return gameDate >= today
    }) ?? 0)

    const handleStar = async () => {
        const newStared = !stared
        setStared(newStared)
        try {
            if (newStared) {
                await favoriteTeam(teamId)
            } else {
                await unfavoriteTeam(teamId)
            }
        } catch (error) {
            setStared(!newStared)
            console.log(error)
        }
    }

    return (
        <div className="space-y-6">
            <Card className="border bg-white/85 shadow-sm">
                <CardContent className="flex flex-wrap items-center justify-between gap-6 p-6">
                    <div className="flex items-center gap-4">
                        <div
                            className="rounded-2xl p-3 shadow-sm"
                            style={{ backgroundColor: team.primaryColor ? `${team.primaryColor}20` : undefined }}
                        >
                            <img className="h-14 w-14 object-contain" src={team.logoUrl} alt={team.fullName} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-semibold">{team.fullName}</h1>
                            <div className="mt-2 flex flex-wrap gap-3 text-sm text-muted-foreground">
                                <span>{conference}第{team.rank}</span>
                                <span>{team.wins}胜{team.losses}负</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <div>
                            <p>成立年份</p>
                            <p className="font-semibold text-foreground">{team.yearFounded ?? '-'}</p>
                        </div>
                        <div>
                            <p>总冠军数</p>
                            <p className="font-semibold text-foreground">{team.championship ?? '-'}</p>
                        </div>
                        {!!user && (
                            <Button variant={stared ? "secondary" : "outline"} size="sm" onClick={handleStar} className="gap-2">
                                <StarIcon className={`h-4 w-4 ${stared ? "text-yellow-500" : ""}`} />
                                {stared ? '已订阅' : '订阅'}
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>

            <Card className="border bg-white/85 shadow-sm">
                <CardHeader className="pb-2">
                    <CardTitle className="text-base">赛程</CardTitle>
                </CardHeader>
                <CardContent>
                    {games?.length ? (
                        <Carousel className="w-full" opts={{ startIndex: todayIndex, align: "start" }}>
                            <CarouselContent className="-ml-2">
                                {games.map((game) => (
                                    <CarouselItem key={game.id} className="pl-2 basis-full sm:basis-1/2 lg:basis-1/3">
                                        <GameCard game={game} />
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <CarouselPrevious className="left-0" />
                            <CarouselNext className="right-0" />
                        </Carousel>
                    ) : (
                        <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">暂无比赛数据</div>
                    )}
                </CardContent>
            </Card>

            <Card className="border bg-white/85 shadow-sm">
                <CardHeader className="pb-2">
                    <CardTitle className="text-base">球员</CardTitle>
                </CardHeader>
                <CardContent>
                    {players?.length ? (
                        <Carousel className="w-full">
                            <CarouselContent className="-ml-2">
                                {players.map((player) => (
                                    <CarouselItem key={player.id} className="pl-2 basis-full sm:basis-1/2 lg:basis-1/3">
                                        <PlayerCard player={player} />
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <CarouselPrevious className="left-0" />
                            <CarouselNext className="right-0" />
                        </Carousel>
                    ) : (
                        <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">暂无球员数据</div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

export default Team
