import { Card, CardContent } from "@/components/ui/card"
import { useGameByDate} from "../hooks/useGame"
import {useTopTeam} from "../hooks/useTeam"
import {getETDate} from "../utils/date"
import GameCarousel from "../components/GameCarousel"
import MiniTeamRanking from "../components/MiniTeamRanking"
import MiniPlayerRanking from "../components/MiniPlayerRanking"
import MvpCard from "../components/MvpCard"
import NewsCarousel from "../components/NewsCarousel"
import News from "../components/News"
const Home = () => {
  const {data} = useGameByDate(getETDate())
   const TodaysGame = data?.games
  return (
  <div>
    <GameCarousel games={TodaysGame} />
    <div className="flex gap-4 p-4">
      <div className="flex flex-col w-3/4 gap-4">
        <div className="flex gap-4">
          <div className="w-1/3">
            <MvpCard/>
          </div>
          <div className="w-2/3">
            <NewsCarousel/>
          </div>
        </div>
        <News/>
      </div>
      <div className="flex flex-col w-1/4 gap-2">
        <MiniTeamRanking/>
        <MiniPlayerRanking/>
      </div>
    </div>
  </div>
)
}
export default Home