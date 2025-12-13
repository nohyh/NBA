import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Layout from './components/Layout'
import Search from './pages/Search'
import Calendar from './pages/Calendar'
import TeamRank from './pages/TeamRank'
import PlayerRank from './pages/PlayerRank'
import My from './pages/My'
import Setting from './pages/Setting'
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout/>}>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/team-rank" element={<TeamRank />} />
          <Route path="/player-rank" element={<PlayerRank />} />
          <Route path="/my" element={<My />} />
          <Route path="/setting" element={<Setting />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App