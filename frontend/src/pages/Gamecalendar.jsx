import { Calendar} from "@/components/ui/calendar"
import {Popover,PopoverContent,PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { CalendarIcon } from "lucide-react"
import { useMemo, useEffect, useState } from "react"
import {useGameByDate} from "../hooks/useGame"
import{GameCard} from "../components/GameCard"
const GameCalendar =()=>{

    const week =['星期一','星期二','星期三','星期四','星期五','星期六','星期日']
    const [date, setDate] = useState(new Date())
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [open, setOpen] = useState(false)
    const monday = useMemo(() => {
    const m = new Date(selectedDate);
    const dayOfWeek = selectedDate.getDay() || 7; 
    m.setDate(selectedDate.getDate() - dayOfWeek + 1);
    return m;
}, [selectedDate]);
    const{year,month} =useMemo(()=>({
        year:monday.getFullYear(),
        month:monday.getMonth()+1,
    }),[monday])
    const weekDates =useMemo(()=>{
      const dates =[]
      for(let i=0;i<7;i++){
        const d = new Date(monday)
        d.setDate(monday.getDate()+i);
        dates.push(d);
      }
      return dates;
    },[monday])
    useEffect(()=>{
      setSelectedDate(date)
    },[date])

    const {data:{games=[]}={}} =useGameByDate(date)

    return(
    <div>
        <div className="flex w-4/5 h-[160px] items-center justify-center rounded-3xl overflow-hidden shadow-xl bg-white mx-auto mt-10  gap-2">
        <div className="flex ">
          <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button id="date-picker"variant="ghost" className="gap-2">
                <p>{year}年{month}月</p>
              <CalendarIcon className="size-5" />
              <span className="sr-only">Select date</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="end">
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"  
              onSelect={(d)=>setDate(d||date)}
              fromYear={2021}
              toYear={2026}
            />
          </PopoverContent>
        </Popover>
        </div>
        <div className="flex">
            <Button variant="ghost" onClick={()=>setSelectedDate(prev => {
    const newDate = new Date(prev);
    newDate.setDate(newDate.getDate() - 7);
    return newDate;
})}>{'<'}</Button>
            <div className="flex gap-2">
                {weekDates.map((item,index)=>(
                  <Button  key={item}  variant="ghost" onClick={()=>setDate(item)}>
                    <div className="flex flex-col items-center">
                      <p>{week[index]}</p>
                    <p>{item.getDate()}</p>
                    </div>
                  </Button>
                ))}
            </div>
            <Button variant="ghost" onClick={()=>setSelectedDate(prev => {
    const newDate = new Date(prev);
    newDate.setDate(newDate.getDate() + 7);
    return newDate;
})}>{'>'}</Button>
        </div>
        <Button variant="ghost" className="bg-gray-200" onClick={()=>setDate(new Date())}> RESET</Button>
        </div>
        <div className="flex flex-wrap w-4/5  items-center justify-center rounded-3xl overflow-hidden shadow-xl bg-white mx-auto mt-10  gap-10">
          {games.length>0?(games.map((game)=>(
                <div className="flex w-1/4 mb-10" key={game.id}>
                  <GameCard game={game}/>
                </div>
            ))):(
              <p className=" flex items-center justify-center text-2xl h-[40vh]">今天无比赛</p>
            )}
        </div>
    </div>
    )
}
export default GameCalendar