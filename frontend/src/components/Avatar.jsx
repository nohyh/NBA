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
      <PopoverContent className="w-32 ">
        <div className="flex flex-col gap-4">
          <Link to="/profile">
            <Button className="flex items-center justify-center gap-2 cursor-pointer w-full ">
              Profile
            </Button>
          </Link>
          <Link to="/">
            <Button onClick={signOut} className="flex items-center justify-center gap-2 cursor-pointer w-full ">
              Sign Out
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
