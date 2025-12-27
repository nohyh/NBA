import { useSearchPlayer } from "../hooks/usePlayer";
import{Input} from "../components/ui/input"
import { Button } from "../components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
const search =()=>{
    const navigate = useNavigate()
    const [input,setInput] = useState('')
    const [searchTerm,setSearchTerm] = useState('')
    const {data:{players=[]}={}} = useSearchPlayer(searchTerm)
    if(!players){
        return(
            <div className="flex justify-center items-center h-screen">
                <h1>Loading...</h1>
            </div>
        )
    }
    const handleSearch = async()=>{
         setSearchTerm(input)
    }
    return(
        <div className=" rounded-3xl bg-white shadow-xl overflow-hidden min-h-screen p-5">
        <div className="flex flex-wrap gap-2">
            <div className="flex gap-2 w-full items-center" >
            <Input type="text" placeholder="Search" className="w-[300px]" value={input} onChange={(e)=>setInput(e.target.value)}/>
            <Button disabled={!input} className='cursor-pointer' onClick={handleSearch}>Search</Button>
            </div>
            <div className="w-[80%] flex flex-wrap gap-2 rounded-3xl ">
                {players.length>0&&players.map((player)=>(
                    <div key={player.id} className ="relative h-[400px] w-[280px] overflow-hidden rounded-3xl bg-white shadow-xl cursor-pointer" onClick={()=>navigate(`/player/${player.id}`)}>
        <img src={player.headshotUrl} className="absolute inset-0 h-full w-full object-cover" alt={player.fullName}/>
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/70 to-transparent"/>
        <div className="absolute bottom-6 left-6 right-6">
                <h2 className="text-2xl font-bold text-gray-900">{player.fullName}</h2>
                <div className="mt-3 flex gap-4 text-sm font-semibold text-gray-900">
                    <span>{player.team?.fullName??'N/A'}</span>
                </div>
            </div>
            </div>
                ))}
            </div>
        </div>
        </div>
    )
}
export default search