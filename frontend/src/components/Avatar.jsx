import{Avatar,AvatarFallback,AvatarImage} from "./ui/avatar"
import{Popover,PopoverContent,PopoverTrigger} from "./ui/popover"
import {Button} from "./ui/button"
import{Link} from "react-router-dom"
import LoginDialog from "../pages/Login"
import { useAuth } from "../context/AuthContext"
const UserAvatar = () => {
  const {user,signOut} = useAuth();
  const isLoggedIn = !!user;
  return isLoggedIn ? (
    <Popover>
      <PopoverTrigger>
        <Avatar className="cursor-pointer">
          <AvatarImage src={user.avatarUrl || "https://github.com/evilrabbit.png"} alt={user.username} />
          <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
      </PopoverTrigger>
      <PopoverContent className="w-40 p-2">
        <div className="flex flex-col gap-1">
          <Link to="/profile">
            <Button variant="ghost" className="flex w-full justify-start gap-2">
              个人资料
            </Button>
          </Link>
          <Link to="/">
            <Button variant="ghost" onClick={signOut} className="flex w-full justify-start gap-2 text-red-500 hover:text-red-600">
              退出登录
            </Button>
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  ) : (
    <LoginDialog/>
  )
}
export default UserAvatar
