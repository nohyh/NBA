import { Outlet } from "react-router-dom"
import { SidebarProvider, SidebarTrigger } from "./ui/sidebar"
import AppSidebar from "./AppSidebar"
import UserAvatar from "./Avatar"
const Layout = () => {
    return (
        <SidebarProvider>
            <AppSidebar />
            <div className="flex min-h-svh flex-1 flex-col">
                <header className="sticky top-0 z-30 flex items-center justify-between border-b bg-background/80 px-4 py-3 backdrop-blur md:px-8">
                    <div className="flex items-center gap-3">
                        <SidebarTrigger className="md:hidden" />
                        <img
                            src="/images/nba-logo.jpg"
                            alt="NBA"
                            className="hidden h-8 w-8 rounded-lg object-contain md:inline-flex"
                        />
                        <div className="flex flex-col leading-tight">
                            <span className="text-xs uppercase tracking-widest text-muted-foreground">NOHYH</span>
                            <span className="text-lg font-semibold tracking-tight">Dashboard</span>
                        </div>
                    </div>
                    <UserAvatar />
                </header>
                <main className="flex-1">
                    <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-8 md:py-8">
                        <Outlet />
                    </div>
                </main>
            </div>
        </SidebarProvider>
    )
}
export default Layout
