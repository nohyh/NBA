// components/app-sidebar.tsx
import { Calendar, Home, Inbox, Search, Settings, Trophy ,BarChart3,User} from "lucide-react";
import { Link } from "react-router-dom"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar"

// 菜单数据
const items = [
  { title: "主页", url: "/", icon: Home },
  { title: "搜索", url: "/search", icon: Search },
  { title: "观赛日历", url: "/calendar", icon: Calendar },
  { title: "球队排行", url: "/team-rank", icon:Trophy},
  { title: "个人数据排行", url: "/player-rank", icon:BarChart3},
  {title:"我的",url:"/my",icon:User},
  { title: "设置", url: "/setting", icon: Settings },
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
       <SidebarHeader>
        <div className ="flex items-center gap-2">
            <img 
              src="/images/nba-logo.jpg" 
              alt="NBA Logo" 
              className="w-20 h-12" 
            />
            <span className="text-3xl font-bold">NBA</span>
        </div>    
       </SidebarHeader>   
       <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="py-7">
                    <Link to={item.url} className="text-xl">
                      <item.icon  className="!w-6 !h-6"/>
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
export default AppSidebar