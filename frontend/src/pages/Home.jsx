import GameCarousel from "../components/GameCarousel"
import MiniTeamRanking from "../components/MiniTeamRanking"
import MiniPlayerRanking from "../components/MiniPlayerRanking"
import MvpCard from "../components/MvpCard"
import NewsCarousel from "../components/NewsCarousel"
import News from "../components/News"
import LikedPlayer from "../components/LikedPlayer"
import Trailer from "../components/Trailer"

const Home = () => {
  return (
    <div className="space-y-8">
      <GameCarousel />
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <Trailer />
          <div className="grid gap-6 lg:grid-cols-[1.1fr_1.9fr]">
            <MvpCard />
            <NewsCarousel />
          </div>
          <News />
        </div>
        <div className="space-y-6">
          <MiniTeamRanking />
          <MiniPlayerRanking />
          <LikedPlayer />
        </div>
      </div>
    </div>
  )
}

export default Home
