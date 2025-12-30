import { Button } from "@/components/ui/button"
import { useAuth } from "../context/AuthContext"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { useNavigate } from "react-router-dom"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState, useEffect } from "react"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

const Profile = () => {
  const navigate = useNavigate()
  const { user, update, unfavoritePlayer, unfavoriteTeam } = useAuth()
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    username: user?.username || "",
    password: "",
    newPassword: "",
  })

  useEffect(() => {
    if (!user) {
      navigate("/login")
    }
  }, [user, navigate])

  useEffect(() => {
    if (user?.username) {
      setFormData((prev) => ({
        ...prev,
        username: user.username,
      }))
    }
  }, [user])

  const hasNoChange =
    formData.username === user?.username &&
    formData.password === "" &&
    formData.newPassword === ""
  const hasMissingNewPassword = formData.password !== "" && formData.newPassword === ""
  const isSubmitDisabled = hasNoChange || hasMissingNewPassword

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleEditProfile = async () => {
    const { success, error } = await update(
      formData.username,
      formData.password,
      formData.newPassword
    )
    if (success) {
      setOpen(false)
      setFormData((prev) => ({ ...prev, password: "", newPassword: "" }))
    } else {
      alert(error)
    }
  }

  if (!user) {
    return null
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
      <Card className="border bg-white/85 shadow-sm">
        <CardContent className="flex flex-col items-center gap-5 p-6 text-center">
          <Avatar className="h-36 w-36 cursor-pointer">
            <AvatarImage src={user.avatarUrl} alt={user.username} />
            <AvatarFallback>{user.username?.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-semibold">{user.username}</h1>
            <p className="text-sm text-muted-foreground">个人资料</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="w-full">编辑资料</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>编辑资料</DialogTitle>
                <DialogDescription>在这里更新你的用户名或密码。</DialogDescription>
              </DialogHeader>
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault()
                  handleEditProfile()
                }}
              >
                <div className="space-y-2">
                  <Label htmlFor="username">用户名</Label>
                  <Input
                    id="username"
                    name="username"
                    placeholder="请输入你的新用户名"
                    value={formData.username}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">密码</Label>
                  <Input
                    id="password"
                    type="password"
                    name="password"
                    placeholder="请输入你的原始密码"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <Input
                    id="newPassword"
                    type="password"
                    name="newPassword"
                    disabled={formData.password === ""}
                    placeholder="请输入你的新密码"
                    value={formData.newPassword}
                    onChange={handleChange}
                  />
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">取消</Button>
                  </DialogClose>
                  <Button disabled={isSubmitDisabled} type="submit">
                    保存
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card className="border bg-white/85 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">我喜欢的球员</CardTitle>
          </CardHeader>
          <CardContent>
            {user.favoritePlayers?.length ? (
              <div className="space-y-3">
                {user.favoritePlayers.map((player) => (
                  <div
                    key={player.id}
                    className="flex items-center justify-between rounded-xl border bg-muted/40 px-3 py-2"
                  >
                    <div className="flex items-center gap-3">
                      {player.headshotUrl ? (
                        <img
                          src={player.headshotUrl}
                          alt={player.fullName}
                          className="h-9 w-9 rounded-full object-cover bg-muted"
                          loading="lazy"
                        />
                      ) : null}
                      <span className="font-medium">{player.fullName}</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-red-200 text-red-500 hover:bg-red-50"
                      onClick={() => unfavoritePlayer(player.id)}
                    >
                      取消订阅
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 text-sm text-muted-foreground">暂无收藏球员</div>
            )}
          </CardContent>
        </Card>

        <Card className="border bg-white/85 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">我喜欢的球队</CardTitle>
          </CardHeader>
          <CardContent>
            {user.favoriteTeams?.length ? (
              <div className="space-y-3">
                {user.favoriteTeams.map((team) => (
                  <div
                    key={team.id}
                    className="flex items-center justify-between rounded-xl border bg-muted/40 px-3 py-2"
                  >
                    <div className="flex items-center gap-3">
                      {team.logoUrl ? (
                        <img
                          src={team.logoUrl}
                          alt={team.fullName}
                          className="h-8 w-8 object-contain"
                          loading="lazy"
                        />
                      ) : null}
                      <span className="font-medium">{team.fullName}</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-red-200 text-red-500 hover:bg-red-50"
                      onClick={() => unfavoriteTeam(team.id)}
                    >
                      取消订阅
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 text-sm text-muted-foreground">暂无收藏球队</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Profile
