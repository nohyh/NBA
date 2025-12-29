import { useTopTeam } from "../hooks/useTeam"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState } from 'react'
import { Skeleton } from "@/components/ui/skeleton"
const TeamRank = () => {
  const navigate = useNavigate()
  const [leftType, setLeftType] = useState('east')
  const [rightType, setRightType] = useState('west')
  const [leftSeason, setLeftSeason] = useState('2025-26')
  const [rightSeason, setRightSeason] = useState('2025-26')
  const [leftExpanded, setLeftExpanded] = useState(true)
  const [rightExpanded, setRightExpanded] = useState(true)
  const validtypes = ['east', 'west', 'pts', 'oppPts', 'offRating', 'defRating', 'reb', 'ast'];
  const validSeasons = ['2021-22', '2022-23', '2023-24', '2024-25', '2025-26'];
  const { data: { teams: leftTeams = [] } = {},isLoading:leftIsLoading } = useTopTeam(leftType, leftSeason)
  const { data: { teams: rightTeams = [] } = {},isLoading:rightIsLoading } = useTopTeam(rightType, rightSeason)
  const leftClass = leftExpanded ? 'flex-wrap justify-center w-1/2   rounded-3xl overflow-hidden shadow-xl mr-8' : 'hidden'
  const rightClass = rightExpanded ? 'flex-wrap justify-center w-1/2   rounded-3xl overflow-hidden shadow-xl mr-8' : 'hidden'
  if(leftIsLoading || rightIsLoading){
    return(
      <div>
        <Skeleton className="w-4/5 h-[160px] mx-auto mt-10 rounded-3xl" />
        <Skeleton className="w-4/5 h-[600px] mx-auto mt-10 rounded-3xl" />
      </div>
    )
  }
  return (
    <div className="flex justify-center">
      <div className="flex  justify-around w-4/5 my-10">
        <Button onClick={() => setLeftExpanded(!leftExpanded)}>
          {leftExpanded ? 'Fold' : 'Expand'}
        </Button>
        <div className={leftClass}>
          <div className="flex">
            <Select defaultValue={leftType} onValueChange={(value) => setLeftType(value)}>
              <SelectTrigger className="w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {validtypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select defaultValue={leftSeason} onValueChange={(value) => setLeftSeason(value)}>
              <SelectTrigger className="w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {validSeasons.map((season) => (
                  <SelectItem key={season} value={season}>
                    {season}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-y-5">
            <div className=" flex items-center   font-bold text-sm mt-3 ">
              <span className="w-1/2 ml-5 ">{`${leftType} Leaderboard`}</span>
              {leftType === 'east' || leftType === 'west' ? <div className="flex">
                <span>WIN-LOSS</span><span className="ml-5">WINRATE</span>
              </div> : <span>DATA</span>}
            </div>
            {leftTeams.map((item, index) => (
              <div className="flex items-center gap-4 cursor-pointer hover:bg-gray-100 p-1 rounded" key={item.id} onClick={() => navigate(`/team/${item.team ? item.team.id : item.id}`)}>
                <div className="flex items-center gap-4 w-1/2">
                  <p className="font-bold ml-2 ">{index + 1}</p>
                  <img className="w-16 h-16" src={item.team ? item.team.logoUrl : item.logoUrl} alt={item.team ? item.team.name : item.name} />
                  <p className="font-bold ">{item.team ? item.team.name : item.name}</p>
                </div>
                {leftType === 'east' || leftType === 'west' ? <div className="flex ml-5"><p>{`${item.wins}-${item.losses}`}</p><p className="ml-12"> {`${(item.winRate * 100).toFixed(1)}%`}</p></div> : <p>{item[leftType]}</p>}
              </div>
            ))}
          </div>
        </div>
        <Button onClick={() => setRightExpanded(!rightExpanded)}>
          {rightExpanded ? 'Fold' : 'Expand'}
        </Button>
        <div className={rightClass}>
          <div className="flex">
            <Select defaultValue={rightType} onValueChange={(value) => setRightType(value)}>
              <SelectTrigger className="w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {validtypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select defaultValue={rightSeason} onValueChange={(value) => setRightSeason(value)}>
              <SelectTrigger className="w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {validSeasons.map((season) => (
                  <SelectItem key={season} value={season}>
                    {season}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-y-5">
            <div className=" flex items-center   font-bold text-sm mt-3 ">
              <span className="w-1/2 ml-5 ">{`${rightType} Leaderboard`}</span>
              {rightType === 'east' || rightType === 'west' ? <div className="flex">
                <span>WIN-LOSS</span><span className="ml-5">WINRATE</span>
              </div> : <span>DATA</span>}
            </div>
            {rightTeams.map((item, index) => (
              <div className="flex items-center gap-4 cursor-pointer hover:bg-gray-100 p-1 rounded" key={item.id} onClick={() => navigate(`/team/${item.team ? item.team.id : item.id}`)}>
                <div className="flex items-center gap-4 w-1/2">
                  <p className="font-bold ml-2 ">{index + 1}</p>
                  <img className="w-16 h-16" src={item.team ? item.team.logoUrl : item.logoUrl} alt={item.team ? item.team.name : item.name} />
                  <p className="font-bold">{item.team ? item.team.name : item.name}</p>
                </div>
                {rightType === 'east' || rightType === 'west' ? <div className="flex ml-5"><p>{`${item.wins}-${item.losses}`}</p><p className="ml-12"> {`${(item.winRate * 100).toFixed(1)}%`}</p></div> : <p>{item[rightType]}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
export default TeamRank