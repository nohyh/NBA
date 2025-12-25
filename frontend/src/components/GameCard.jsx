
const GameCard = ({ game }) => (
  <div className="relative rounded-2xl bg-white shadow-lg">
    <div className="flex items-center justify-between p-4 ">
    <div className="flex items-center">
    <span className="text-xs font-semibold pr-1">
      {game.homeTeam.abbreviation}
    </span>
    <img src={game.homeTeam.logoUrl} alt={game.homeTeam.abbreviation} className="w-10 h-10"/>
    </div>
    <div className="flex flex-col items-center  my-10">
        <span className="font-bold tabular-nums  text-xl ">{game.homeTeamScore ?? '-'} - {game.awayTeamScore ?? '-'}</span>
    </div>
    <div className ="flex items-center ">
    <img src={game.awayTeam.logoUrl} alt={game.awayTeam.abbreviation} className="w-10 h-10 pr-1"/>
    <span className="text-xs font-semibold">
      {game.awayTeam.abbreviation}
    </span>
    </div>
    </div>
    <span className="absolute top-8 left-1/2 -translate-x-1/2 text-sm"> NBA常规赛</span>
    <span className="absolute top-2 right-5 translate-x-1/2 text-xs"> {(game.gameDate).slice(5,10)}</span>
    <span className={`absolute bottom-5 left-1/2 -translate-x-1/2 text-sm ${game.status==='Final' ? 'text-black':game.status.includes('Q')?'text-red-500':'text-green-500'}`}>
     {game.status}
    </span>
  </div>
)
export default GameCard