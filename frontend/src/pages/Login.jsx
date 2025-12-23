import { Dialog,DialogContent,DialogHeader,DialogTitle,DialogTrigger} from "@/components/ui/dialog"
import {Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import{useState} from "react"
import { useAuth } from "../context/AuthContext"
import {ArrowLeft} from "lucide-react"
const LoginDialog =() =>{
    const [open, setOpen] = useState(false)
    const {checkUsername,signIn,signUp} = useAuth();
    const [step,setStep] = useState('username')
    const [username,setUsername] = useState('')
    const [password,setPassword] = useState('')
    const [error,setError] = useState('')
    const handleNameSubmit = async (e) => {
        e.preventDefault();
        const isExist=await checkUsername(username)
         if(isExist){
            setStep('password')
         }
         else{
            setStep('signUp')
         }
    }
    const handleSignIn =async(e) =>{
         e.preventDefault();
         const res = await signIn({user: {username,password}})
         if(res.error){
            setError(res.error)
         }
         else{
            setStep('username')
            setOpen(false)
         }
    }
    const handleSignUp =async(e)=>{
         e.preventDefault();
         const res = await signUp({user: {username,password}})
         if(res.error){
            setError(res.error)
         }
         else{
            setStep('username')
            setOpen(false)
         }
    }
    return(
        <Dialog open ={open} onOpenChange={setOpen}>
            <DialogTrigger className="cursor-pointer" asChild>
                <Button>Login</Button>
            </DialogTrigger>
            <DialogContent className=" w-[600px]  h-[650px] overflow-hidden rounded-2xl bg-white shadow-lg">
                <DialogHeader>
                {step!=='username' && (
                    <button className=" absolute left-4 top-4 cursor-pointer" onClick={()=>setStep('username')}>
                        <ArrowLeft/>
                    </button>
                )}
                    <DialogTitle><div className="p-3 flex justify-center">
  <h1 className="text-xl font-extrabold tracking-tighter">
    <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 animate-pulse">
      NOHYH
    </span>
  </h1>
</div></DialogTitle>
                    {step==='username'?(
                    <>
                    <p className="text-center font-bold text-3xl mt-20 "> 登录/注册</p>
                    <form onSubmit={handleNameSubmit} className="flex flex-col gap-5 mt-10">
                        <Input value={username} onChange={(e)=>setUsername(e.target.value)} className="w-[400px] h-[60px] mx-auto " type="text" placeholder="用户名" />
                        <Button  className='cursor-pointer w-[400px] h-[60px] mx-auto rounded-3xl mt-5' type="submit">下一步</Button>
                    </form>
                    </>):
                    step==='password'?(
                    <>
                    <p className="text-center font-bold text-3xl mt-20 "> 请输入密码</p>
                    <p className="text-center text-gray-500 font-semibold text-xs mt-5"> 不是你？请点击左上角返回</p>
                    <form onSubmit={handleSignIn} className="flex flex-col gap-5 mt-10">
                        <Input value={password} onChange={(e)=>setPassword(e.target.value)} className="w-[400px] h-[60px] mx-auto " type="password" placeholder="密码" />
                        <Button className='cursor-pointer w-[400px] h-[60px] mx-auto rounded-3xl mt-5' type="submit">提交</Button>
                        <p className="text-center text-red-500 font-semibold text-xs mt-5">{error}</p>
                    </form>
                    </>):
                    (
                    <>
                    <p className="text-center font-bold text-3xl mt-20 "> 注册你的账号</p>
                    <form onSubmit={handleSignUp} className="flex flex-col gap-5 mt-10">
                        <Input value={username} onChange={(e)=>setUsername(e.target.value)} className="w-[400px] h-[60px] mx-auto " type="text" placeholder="用户名" />
                        <Input value={password} onChange={(e)=>setPassword(e.target.value)} className="w-[400px] h-[60px] mx-auto " type="password" placeholder="密码" />
                        <Button className='cursor-pointer w-[400px] h-[60px] mx-auto rounded-3xl mt-5' type="submit">提交</Button>
                        <p className="text-center text-red-500 font-semibold text-xs mt-5">{error}</p>
                    </form>
                    </>)}
                  
                </DialogHeader>
            </DialogContent>
        </Dialog>)
        }
export default LoginDialog
