import { useNavigate } from "react-router-dom"
import { Card } from "@/components/ui/card"

const PlayerCard = ({ player }) => {
  const navigate = useNavigate()

  if (!player || !player.seasonStats?.length) return null

  return (
    <Card
      className="relative h-[320px] w-full overflow-hidden border bg-white/85 shadow-sm cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-lg"
      onClick={() => navigate(`/player/${player.id}`)}
    >
      <img src={player.headshotUrl} className="absolute inset-0 h-full w-full object-cover" alt={player.fullName} />
      <div className="absolute inset-0 bg-gradient-to-t from-white via-white/70 to-transparent" />
      <div className="absolute bottom-6 left-6 right-6">
        <h2 className="text-2xl font-bold text-gray-900">{player.fullName}</h2>
        <div className="mt-3 flex gap-4 text-sm font-semibold text-gray-900">
          <span>{player.seasonStats[0].pts}分</span>
          <span>{player.seasonStats[0].reb}篮板</span>
          <span>{player.seasonStats[0].ast}助攻</span>
        </div>
      </div>
    </Card>
  )
}

export default PlayerCard
