import {Outlet}  from 'react-router-dom'
import { SidebarProvider} from './ui/sidebar' 
import AppSidebar from './AppSidebar'
const Layout =()=>{
    return(
        <SidebarProvider>
            <AppSidebar/>
            <main className ="flex flex-1 flex-col h-screen overflow-hidden">
            <div className='flex-1 overflow-auto p-6'>
            <Outlet/>
            </div>
            </main>
        </SidebarProvider>
    
    )
}
export default Layout