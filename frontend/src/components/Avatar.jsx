import{Avatar,AvatarFallback,AvatarImage} from "./ui/avatar"
import{Popover,PopoverContent,PopoverTrigger} from "./ui/popover"
import {Button} from "./ui/button"
import{Link} from "react-router-dom"
//import{isLogin} from "../utils/auth"
const UserAvatar = () => {
  const isLoggedIn = true;
  return isLoggedIn ? (
    <Popover>
      <PopoverTrigger>
        <Avatar className="cursor-pointer">
          <AvatarImage src="https://github.com/evilrabbit.png" alt="evilrabbit" />
          <AvatarFallback>CN</AvatarFallback>
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
            <Button className="flex items-center justify-center gap-2 cursor-pointer w-full ">
              Sign Out
            </Button>
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  ) : (
    <Link to="/login">
      <Button className="flex items-center justify-center gap-2 cursor-pointer w-full ">
        Login
      </Button>
    </Link>
  )
}
export default UserAvatar
