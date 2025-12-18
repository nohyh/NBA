import { Card, CardContent } from "@/components/ui/card"
import{Link} from "react-router-dom"
import { useTodayMvp } from "@/hooks/usePlayer"

const MvpCard = ()=>{
    const {data} = useTodayMvp();
    const mvp =data?.mvp;
    if(!mvp){
        return null;
    }
    return(
        <Card>
            <CardContent>
                <div>
                    

                </div>
            </CardContent>
        </Card>
    )
}
export default MvpCard