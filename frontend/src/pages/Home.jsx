import { Card, CardContent } from "@/components/ui/card"
import { useGameByDate} from "../hooks/useGame"
import {getETDate} from "../utils/date"
import GameCarousel from "../components/GameCarousel"
const Home = () => {

  const {data,isLoading,error} = useGameByDate(getETDate())
  const TodaysGame = data?.games
  return (
    <div>
      <GameCarousel games={TodaysGame} />
    </div>

  )
}
export default Home