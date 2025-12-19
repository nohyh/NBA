import{Link} from "react-router-dom"
import { useTodayMvp } from "@/hooks/usePlayer"

const MvpCard = () => {
  const { data } = useTodayMvp()
  const mvp = data?.mvp
  
  if (!mvp) return null
  return (
    <div className ="relative h-[400px] w-[280px] overflow-hidden rounded-3xl bg-white shadow-xl">
        <img src={mvp.player.headshotUrl} className="absolute inset-0 h-full w-full object-cover" alt={mvp.player.fullName}/>
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/70 to-transparent"/>
        <div className="absolute bottom-6 left-6 right-6">
                <p className="text-xl text-gray-400"> 今日最佳球员</p>
                <h2 className="text-2xl font-bold text-gray-900">{mvp.player.fullName}</h2>
                <div className="mt-3 flex gap-4 text-sm font-semibold text-gray-900">
                    <span> {mvp.pts}PTS</span>
                    <span> {mvp.reb}REB</span>
                    <span> {mvp.ast}AST</span>
                </div>
            </div>
    </div>
  )
}
export default MvpCard