import {useNews} from "@/hooks/useNews";
const News =()=>{
    const{data:news}=useNews()
    if(!news){
        return null
    }
    return(
        <div className="w-full rounded-3xl shadow-xl bg-white divide-y divide-gray-200">
            {
                news.map((item)=>(
                    <a href={item.url} target="_blank" rel="noopener noreferrer"  key={item.id}>
                    <div className="p-4">
                        <h2 className="text-lg font-semibold my-2">{item.title}</h2>
                        <p className="text-sm text-gray-600">{item.createdAt.slice(0,10)} from {item.source}</p>
                    </div>
                    </a>
                ))
            }
        </div>
    )
}
export default News