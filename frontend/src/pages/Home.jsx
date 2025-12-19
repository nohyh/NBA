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
  const {data:topTeam} = useTopTeam(3)
  //三个队伍用于展示
  return (
    <div>
      <GameCarousel games={TodaysGame} />
      <div className="flex gap-4 p-4">
        <div className="flex w-1/4 mr-auto gap-y-2">
          <MvpCard/>
        </div>
        <div className="flex w-1/2 gap-y-2">
          <NewsCarousel/>
        </div>
        <div className=" flex flex-col w-1/4 ml-auto gap-y-2"> 
          <MiniTeamRanking teams={topTeam}/>
           <MiniPlayerRanking/>
        </div>
      </div>
      <div className="flex w-3/4 mr-auto gap-y-2">
          <News/>
        </div>
    </div>

  )
}
export default Home