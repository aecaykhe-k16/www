import { useState } from "react"
import DashboardStatsGrid from "./DashboardStatsGrid"
import PopularProducts from "./PopularProducts"
import RecentOrders from "./RecentOrders"
import TransactionChart from "./TransactionChart"

const Dashboard = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg ">
      <DashboardStatsGrid />
      <div className="flex  gap-4 my-4">
        <TransactionChart />
      </div>
      <div className="flex gap-4">
        <RecentOrders />
        <PopularProducts />
      </div>
    </div>
  )
}

export default Dashboard
