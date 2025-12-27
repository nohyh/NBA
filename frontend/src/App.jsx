import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Layout from './components/Layout'
import Search from './pages/Search'
import Gamecalendar from './pages/Gamecalendar'
import TeamRank from './pages/TeamRank'
import PlayerRank from './pages/PlayerRank'
import Profile from './pages/Profile'
import Player from './pages/Player'
import {AuthProvider}  from './context/AuthContext.jsx'
import Team from './pages/Team'
import Game from './pages/Game'
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
      <Routes>
        <Route element={<Layout/>}>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/calendar" element={<Gamecalendar />} />
          <Route path="/team-rank" element={<TeamRank />} />
          <Route path="/player-rank" element={<PlayerRank />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/player/:playerId" element={<Player/>} />
          <Route path="/team/:teamId" element={<Team/>} />
          <Route path="/game/:gameId" element={<Game/>} />
        </Route>
      </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App