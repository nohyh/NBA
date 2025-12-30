import { useNews } from "@/hooks/useNews";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
const News =()=>{
    const{data:news}=useNews()
    if(!news){
        return null
    }
    return(
        <Card className="border bg-white/85 shadow-sm">
            <CardHeader className="border-b">
                <CardTitle className="text-base">新闻快讯</CardTitle>
            </CardHeader>
            <CardContent className="divide-y px-0">
                {news.map((item)=>(
                    <a href={item.url} target="_blank" rel="noopener noreferrer"  key={item.id} className="block px-6 py-4 hover:bg-muted/40 transition-colors">
                        <h2 className="text-lg font-semibold">{item.title}</h2>
                        <p className="text-sm text-muted-foreground mt-1">{item.createdAt.slice(0,10)} · {item.source}</p>
                    </a>
                ))}
            </CardContent>
        </Card>
    )
}
export default News
