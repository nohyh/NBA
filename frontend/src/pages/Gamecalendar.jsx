import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { CalendarIcon, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react"
import { useMemo, useEffect, useState } from "react"
import { useGameByDate } from "../hooks/useGame"
import { GameCard } from "../components/GameCard"

const WEEKDAYS = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']

const GameCalendar = () => {
  const [date, setDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [open, setOpen] = useState(false)

  const monday = useMemo(() => {
    const m = new Date(selectedDate)
    const dayOfWeek = selectedDate.getDay() || 7
    m.setDate(selectedDate.getDate() - dayOfWeek + 1)
    return m
  }, [selectedDate])

  const { year, month } = useMemo(() => ({
    year: monday.getFullYear(),
    month: monday.getMonth() + 1,
  }), [monday])

  const weekDates = useMemo(() => {
    const dates = []
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday)
      d.setDate(monday.getDate() + i)
      dates.push(d)
    }
    return dates
  }, [monday])

  useEffect(() => {
    setSelectedDate(date)
  }, [date])

  const { data: { games = [] } = {} } = useGameByDate(date)

  const isToday = (d) => {
    const today = new Date()
    return d.toDateString() === today.toDateString()
  }

  const isSelected = (d) => d.toDateString() === date.toDateString()

  return (
    <div className="space-y-6">
      {/* 日期选择器 */}
      <Card className="border bg-white/85 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* 月份选择 */}
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <CalendarIcon className="w-4 h-4" />
                  {year}年{month}月
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  captionLayout="dropdown"
                  onSelect={(d) => { setDate(d || date); setOpen(false) }}
                  fromYear={2021}
                  toYear={2026}
                />
              </PopoverContent>
            </Popover>

            {/* 周选择器 */}
            <div className="flex flex-wrap items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedDate(prev => {
                  const newDate = new Date(prev)
                  newDate.setDate(newDate.getDate() - 7)
                  return newDate
                })}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>

              <div className="flex gap-1">
                {weekDates.map((item, index) => (
                  <Button
                    key={item.toISOString()}
                    variant={isSelected(item) ? "default" : isToday(item) ? "outline" : "ghost"}
                    className="flex flex-col h-auto min-w-[60px] rounded-xl px-3 py-2"
                    onClick={() => setDate(item)}
                  >
                    <span className="text-xs">{WEEKDAYS[index]}</span>
                    <span className="text-lg font-bold">{item.getDate()}</span>
                  </Button>
                ))}
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedDate(prev => {
                  const newDate = new Date(prev)
                  newDate.setDate(newDate.getDate() + 7)
                  return newDate
                })}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            {/* 重置按钮 */}
            <Button variant="outline" onClick={() => setDate(new Date())}>
              <RotateCcw className="w-4 h-4 mr-2" />
              今天
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 比赛列表 */}
      <Card className="border bg-white/85 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">
            {date.toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', weekday: 'long' })}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {games.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {games.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-48 text-muted-foreground">
              当日无比赛安排
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default GameCalendar
