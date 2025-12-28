import { Button } from "@/components/ui/button";
import {useAuth} from "../context/AuthContext";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState,useEffect } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
const Profile = () => {
    const navigate = useNavigate();
    const {user,update,unfavoritePlayer,unfavoriteTeam} = useAuth();
    const [open, setOpen] = useState(false);
    const [formData,setFormData] = useState({
        username:user?.username,
        password:"",
        newPassword:""
    });
    const inputRule = formData.username===user?.username&&formData.password===''&&formData.newPassword===''||formData.password&&!formData.newPassword
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]:e.target.value
        })
    }
    const handleEditProfile = async () => {
        const {success,error} = await update(formData.username,formData.password,formData.newPassword);
        if(success){
            setOpen(false);
        }
        else{
            alert(error);
        }
    }
    if(!user){
        navigate("/login");
    }
    useEffect(() => {
    if (user?.username) {
        setFormData(prev => ({
            ...prev,
            username: user.username
        }));
    }
 }, [user]);
    return (
        <div className=" flex rounded-2xl shadow-lg w-full  overflow-hidden p-5  min-h-[1000px]">
            <div className="flex gap-20 w-4/5 mx-auto">
                <div className="flex flex-col items-center gap-5 ">
                    <Avatar className="w-[250px] h-[250px] rounded-full cursor-pointer">
                        <AvatarImage src={user?.avatarUrl} alt="" />
                        <AvatarFallback>{user?.username.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <h1 className="text-2xl font-bold">{user?.username}</h1>
                     <Dialog open={open} onOpenChange={setOpen}>
                      <DialogTrigger asChild>
          <Button className="w-[250px] cursor-pointer"> edit profile</Button>
        </DialogTrigger>
      <form>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              在这里修改你的信息，点击保存即可
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="username">用户名</Label>
              <Input name="username" placeholder="请输入你的新用户名" value={formData.username} onChange={handleChange} />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="password">密码</Label>
              <Input type="password" name="password" placeholder="请输入你的原始密码" value={formData.password} onChange={handleChange} />
              <Input type="password" disabled={formData.password === ""} name="newPassword" placeholder="请输入你的新密码" value={formData.newPassword} onChange={handleChange} />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button disabled={inputRule}onClick={(e)=>{e.preventDefault();handleEditProfile()}} type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
                </div>  
                <div className="flex flex-col gap-5">
                <div className="flex flex-col ">
                     <span>我喜欢的球员</span>
                     <div className=" flex flex-col gap-5 rounded-2xl shadow-lg w-[600px] h-[400px] p-5">
                         {user?.favoritePlayers?.map((player) => (
                             <div key={player.id} className="flex gap-5 items-center">
                                <span >
                                   {player.fullName}
                                </span>
                                <Button className="bg-red-500" onClick={()=>{unfavoritePlayer(player.id)}}>取消订阅</Button>
                            </div>
                         ))}
                     </div>
                </div>
                <div className="flex flex-col ">
                     <span>我喜欢的球队</span>
                     <div className=" flex flex-col gap-5 rounded-2xl shadow-lg w-[600px] h-[400px] p-5">
                         {user?.favoriteTeams?.map((team) => (
                             <div key={team.id} className="flex gap-5 items-center">
                                <span>
                                   {team.fullName}  
                                </span>
                                <Button className="bg-red-500" onClick={()=>{unfavoriteTeam(team.id)}}>取消订阅</Button>
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
