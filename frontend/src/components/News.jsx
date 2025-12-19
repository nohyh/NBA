import {useNews} from "@/hooks/useNews";
const News =()=>{
    const{data:news}=useNews()
    if(!news){
        return null
    }
    return(
        <div className="w-full rounded-3xl shadow-xl bg-white">
            {
                news.map((item)=>(
                    <div key={item.id} className="p-4">
                        <h2 className="text-lg font-semibold">{item.title}</h2>
                        <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                ))
            }
        </div>
    )
}
export default News