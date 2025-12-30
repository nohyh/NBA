import { useNavigate } from "react-router-dom"
import { formatLocalDateMd } from "../utils/date"

const GameCard = ({ game }) => {
  const navigate = useNavigate();
  return (
    <div
      className="relative rounded-2xl bg-white shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
      onClick={() => navigate(`/game/${game.id}`)}
    >
      <div className="flex items-center justify-between p-4 ">
        <div className="flex items-center">
          <span className="text-xs font-semibold pr-1">
            {game.homeTeam.abbreviation}
          </span>
          <img src={game.homeTeam.logoUrl} alt={game.homeTeam.abbreviation} className="w-10 h-10 " />
        </div>
        <div className="flex flex-col items-center  my-10">
          <span className="font-bold tabular-nums  text-xl ">{game.homeTeamScore ?? '-'} - {game.awayTeamScore ?? '-'}</span>
        </div>
        <div className="flex items-center ">
          <img src={game.awayTeam.logoUrl} alt={game.awayTeam.abbreviation} className="w-10 h-10 pr-1" />
          <span className="text-xs font-semibold">
            {game.awayTeam.abbreviation}
          </span>
        </div>
      </div>
      <span className="absolute top-8 left-1/2 -translate-x-1/2 text-sm"> NBA常规赛</span>
      <span className="absolute top-2 right-5 translate-x-1/2 text-xs"> {formatLocalDateMd(game.gameDate)}</span>
      <span className={`absolute bottom-5 left-1/2 -translate-x-1/2 text-sm ${game.status === 'Final' ? 'text-black' : game.status.includes('Q') ? 'text-red-500' : 'text-green-500'}`}>
        {game.status}
      </span>
    </div>
  )
}

const GameCardPlus = ({ game }) => {
  const navigate = useNavigate()
  return (
    <div className="relative rounded-2xl bg-gray-300 shadow-lg w-[500px] h-[300px]">
      <div className="flex items-center justify-between p-4 h-full ">
        <div className="flex flex-col items-center">
          <img onClick={() => navigate(`/team/${game.homeTeam.id}`)} src={game.homeTeam.logoUrl} alt={game.homeTeam.abbreviation} className="w-20 h-20 cursor-pointer" />
          <span className="text-xl font-semibold pr-1">
          {game.homeTeam.abbreviation}
        </span>
        <span className="text-xs font-semibold pr-1 text-green-500">
          主场
        </span>
      </div>
      <div className="flex justify-between  my-10 gap-40">
        <span className="font-bold tabular-nums  text-3xl ">{game.homeTeamScore ?? '-'} </span>
        <span className={`absolute  left-1/2 -translate-x-1/2 text-xl ${game.status === 'Final' ? 'text-black' : game.status.includes('Q') ? 'text-red-500' : 'text-green-500'}`}>
          {game.status}
        </span>
        <span className="font-bold tabular-nums  text-3xl ">{game.awayTeamScore ?? '-'}</span>
      </div>
      <div className="flex flex-col items-center ">
        <img onClick={() => navigate(`/team/${game.awayTeam.id}`)} src={game.awayTeam.logoUrl} alt={game.awayTeam.abbreviation} className="w-20 h-20 cursor-pointer pr-1" />
        <span className="text-xl font-semibold">
          {game.awayTeam.abbreviation}
        </span>
        <span className="text-xs font-semibold pr-1 text-red-500">
          客场
        </span>
      </div>
    </div>
    <span className="absolute top-10 left-1/2 -translate-x-1/2 text-xl"> NBA常规赛</span>
    <span className="absolute top-2 right-5 translate-x-1/2 text-xs"> {formatLocalDateMd(game.gameDate)}</span>
  </div>
)}

export { GameCardPlus, GameCard }
