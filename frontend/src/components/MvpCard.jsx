import { Link } from "react-router-dom"
import { useTodayMvp } from "@/hooks/usePlayer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const MvpCard = () => {
  const { data } = useTodayMvp()
  const mvp = data?.mvp

  if (!mvp) return null

  return (
    <Card className="overflow-hidden h-[400px] border bg-white/85 shadow-sm">
      <Link to={`/player/${mvp.player.id}`} className="block h-full">
        <div className="relative h-full">
          <img
            src={mvp.player.headshotUrl}
            className="absolute inset-0 h-full w-full object-cover"
            alt={mvp.player.fullName}
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <Badge variant="secondary" className="mb-2">今日最佳</Badge>
            <h2 className="text-2xl font-bold mb-3">{mvp.player.fullName}</h2>
            <div className="flex gap-4 text-sm">
              <div className="text-center">
                <p className="text-2xl font-bold">{mvp.pts}</p>
                <p className="text-xs text-white/70">PTS</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{mvp.reb}</p>
                <p className="text-xs text-white/70">REB</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{mvp.ast}</p>
                <p className="text-xs text-white/70">AST</p>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </Card>
  )
}

export default MvpCard
