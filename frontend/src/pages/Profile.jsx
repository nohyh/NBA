import { Button } from "@/components/ui/button";
import {useAuth} from "../context/AuthContext";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
const Profile = () => {
    const navigate = useNavigate();
    const {user} = useAuth();
    if(!user){
        navigate("/login");
    }
    return (
        <div className=" flex rounded-2xl shadow-lg w-full  overflow-hidden p-5  min-h-[1000px]">
            <div className="flex gap-20 w-4/5 mx-auto">
                <div className="flex flex-col items-center gap-5 ">
                    <Avatar className="w-[250px] h-[250px] rounded-full cursor-pointer">
                        <AvatarImage src={user?.avatarUrl} alt="" />
                        <AvatarFallback>{user?.username.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <h1 className="text-2xl font-bold">{user?.username}</h1>
                    <Button className="w-[250px] cursor-pointer"> edit profile</Button>
                </div>  
                <div className="flex flex-col gap-5">
                <div className="flex flex-col ">
                     <span>我喜欢的球员</span>
                     <div className=" flex flex-col gap-5 rounded-2xl shadow-lg w-[600px] h-[400px]">
                         {user?.favoritePlayers?.map((player) => (
                             <div key={player.id}>
                                <span>
                                   {player.fullName}
                                </span>
                            </div>
                         ))}
                     </div>
                </div>
                <div className="flex flex-col ">
                     <span>我喜欢的球队</span>
                     <div className=" flex flex-col gap-5 rounded-2xl shadow-lg w-[600px] h-[400px]">
                         {user?.favoriteTeams?.map((team) => (
                             <div key={team.id}>
                                <span>
                                   {team.fullName}
                                </span>
                            </div>
                         ))}
                     </div>
                </div>
            </div>              
            </div>
        </div>
    );
};

export default Profile;
