import {Outlet}  from 'react-router-dom'
import { SidebarProvider} from './ui/sidebar' 
import AppSidebar from './AppSidebar'
import UserAvatar from './Avatar'
const Layout =()=>{
    return(
        <div className='relative'>
        <div className="absolute top-4 right-4 z-50">
        <UserAvatar />
        </div>
        <SidebarProvider>
            <AppSidebar/>
            <main className ="flex flex-1 flex-col h-screen overflow-hidden">
            <div className='flex-1 overflow-auto p-6'>
            <Outlet/>
            </div>
            </main>
        </SidebarProvider>
        </div>
    )
}
export default Layout