import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Layout from './components/Layout'
import Search from './pages/Search'
import Gamecalendar from './pages/Gamecalendar'
import TeamRank from './pages/TeamRank'
import PlayerRank from './pages/PlayerRank'
import My from './pages/My'
import Profile from './pages/Profile'
import {AuthProvider}  from './context/AuthContext.jsx'
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
          <Route path="/my" element={<My />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App