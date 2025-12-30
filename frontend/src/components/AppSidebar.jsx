// components/app-sidebar.tsx
import { Calendar, Home, Search, Trophy, BarChart3 } from "lucide-react";
import { Link, useLocation } from "react-router-dom"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
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
]

export function AppSidebar() {
  const { pathname } = useLocation();
  return (
    <Sidebar variant="inset" className="border-r border-sidebar-border/60 bg-sidebar/70 backdrop-blur">
      <SidebarContent className="gap-4">
        <SidebarHeader className="px-4 pt-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-sm">
              <img src="/images/nba-logo.jpg" alt="NBA" className="h-9 w-9 object-contain" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-base font-semibold tracking-tight">NOHYH</span>
              <span className="text-xs text-muted-foreground">Basketball Lab</span>
            </div>
          </div>
        </SidebarHeader>
        <SidebarGroup>
          <SidebarGroupLabel>导航</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url} className="h-11 gap-3 px-3 text-[15px]">
                    <Link to={item.url}>
                      <item.icon className="size-5" />
                      <span className="font-medium">{item.title}</span>
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
