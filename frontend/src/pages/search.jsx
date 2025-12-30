import { useSearchPlayer } from "../hooks/usePlayer"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Search as SearchIcon, Loader2 } from "lucide-react"

const Search = () => {
    const navigate = useNavigate()
    const [input, setInput] = useState('')
    const [searchTerm, setSearchTerm] = useState('')
    const { data: { players = [] } = {}, isLoading } = useSearchPlayer(searchTerm)

    const handleSearch = () => {
        if (input.trim()) {
            setSearchTerm(input.trim())
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch()
        }
    }

    return (
        <div className="space-y-6">
            {/* 搜索栏 */}
            <Card className="border bg-white/85 shadow-sm">
                <CardContent className="p-4">
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="搜索球员姓名..."
                                className="pl-10"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                        </div>
                        <Button onClick={handleSearch} disabled={!input.trim() || isLoading}>
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : '搜索'}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* 搜索结果 */}
            {searchTerm && (
                <Card className="border bg-white/85 shadow-sm">
                    <CardContent className="p-6">
                        {isLoading ? (
                            <div className="flex justify-center py-12">
                                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                            </div>
                        ) : players.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {players.map((player) => (
                                    <Card
                                        key={player.id}
                                        className="overflow-hidden border bg-white/85 cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-lg"
                                        onClick={() => navigate(`/player/${player.id}`)}
                                    >
                                        <div className="relative h-48">
                                            <img
                                                src={player.headshotUrl}
                                                className="absolute inset-0 h-full w-full object-cover"
                                                alt={player.fullName}
                                                loading="lazy"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                                                <h3 className="font-bold">{player.fullName}</h3>
                                                <p className="text-sm text-white/70">{player.team?.fullName || 'N/A'}</p>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 text-muted-foreground">
                                未找到匹配的球员
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* 搜索提示 */}
            {!searchTerm && (
                <div className="text-center py-12 text-muted-foreground">
                    输入球员姓名开始搜索
                </div>
            )}
        </div>
    )
}

export default Search
