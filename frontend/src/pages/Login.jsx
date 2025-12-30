import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import { ArrowLeft } from "lucide-react"

const LoginDialog = () => {
  const [open, setOpen] = useState(false)
  const { checkUsername, signIn, signUp } = useAuth()
  const [step, setStep] = useState("username")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const resetState = () => {
    setStep("username")
    setUsername("")
    setPassword("")
    setError("")
  }

  const handleNameSubmit = async (e) => {
    e.preventDefault()
    const name = username.trim()
    if (!name) return
    const isExist = await checkUsername(name)
    setError("")
    setStep(isExist ? "password" : "signUp")
  }

  const handleSignIn = async (e) => {
    e.preventDefault()
    const res = await signIn({ user: { username, password } })
    if (res.error) {
      setError(res.error)
    } else {
      setOpen(false)
      resetState()
    }
  }

  const handleSignUp = async (e) => {
    e.preventDefault()
    const res = await signUp({ user: { username, password } })
    if (res.error) {
      setError(res.error)
    } else {
      setOpen(false)
      resetState()
    }
  }

  const isUsernameStep = step === "username"
  const isPasswordStep = step === "password"
  const isSignUpStep = step === "signUp"

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen)
        if (!nextOpen) {
          resetState()
        }
      }}
    >
      <DialogTrigger asChild>
        <Button>登录</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            {!isUsernameStep ? (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setStep("username")
                  setPassword("")
                  setError("")
                }}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            ) : (
              <div />
            )}
            <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">NOHYH</span>
            <div />
          </div>
          <DialogTitle className="text-2xl">
            {isUsernameStep && "登录 / 注册"}
            {isPasswordStep && "输入密码"}
            {isSignUpStep && "创建账号"}
          </DialogTitle>
          <DialogDescription>
            {isUsernameStep && "请输入用户名，我们会判断是否已有账号。"}
            {isPasswordStep && "欢迎回来，继续输入密码即可登录。"}
            {isSignUpStep && "设置用户名和密码，快速完成注册。"}
          </DialogDescription>
        </DialogHeader>

        {error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </div>
        ) : null}

        {isUsernameStep && (
          <form onSubmit={handleNameSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">用户名</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                type="text"
                placeholder="输入用户名"
              />
            </div>
            <Button className="w-full" type="submit" disabled={!username.trim()}>
              下一步
            </Button>
          </form>
        )}

        {isPasswordStep && (
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">密码</Label>
              <Input
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="输入密码"
              />
            </div>
            <Button className="w-full" type="submit" disabled={!password}>
              登录
            </Button>
          </form>
        )}

        {isSignUpStep && (
          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-username">用户名</Label>
              <Input
                id="new-username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                type="text"
                placeholder="输入用户名"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">密码</Label>
              <Input
                id="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="设置密码"
              />
            </div>
            <Button className="w-full" type="submit" disabled={!username.trim() || !password}>
              注册并登录
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default LoginDialog
