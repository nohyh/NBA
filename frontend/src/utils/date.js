export const getETDate = () => {
   const now = new Date()
   now.setHours(now.getHours() )
   //美国东部时间校正
   return now.toISOString().split("T")[0]
}