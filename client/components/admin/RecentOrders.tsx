import { format } from "date-fns"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { refreshToken } from "../../redux/actions/authAction"
import { getRooms } from "../../redux/actions/roomAction"
import { getUsers } from "../../redux/actions/userAction"
import { getAPI } from "../../utils/fecthData"
import { IBill, RootStore, TypedDispatch } from "../../utils/types"

export default function RecentOrders() {
  const dispatch = useDispatch<TypedDispatch>()
  const [recentOrders, setRecentOrders] = useState<IBill[]>([])

  useEffect(() => {
    const getRecentOrders = async () => {
      await getAPI("bills")
        .then((res) => {
          setRecentOrders(res.data.data)
        })
        .catch((err) => console.log(err))
    }
    getRecentOrders()
    return () => setRecentOrders([])
  }, [])
  useEffect(() => {
    dispatch(getRooms())
    dispatch(getUsers())
    dispatch(refreshToken())
  }, [dispatch])

  const { users } = useSelector((state: RootStore) => state)

  return (
    <div className="bg-white px-4 pt-3 pb-4 rounded-sm border border-gray-200 flex flex-col flex-1 text-center">
      <strong className="text-gray-700 font-medium">Recent Orders</strong>
      <table className="mt-3 w-full text-gray-700">
        <thead>
          <tr>
            <th></th>
            <th>Full name</th>
            <th>Date</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {recentOrders.map((order, index) => {
            const user = users.find((user) => user.id === order.user_ID)
            return (
              <tr key={order.bill_ID}>
                <td className="py-2">
                  <Link href={`/order/${order.bill_ID}`}>#{index + 1}</Link>
                </td>

                <td>
                  <Link href={`/customer/${order.user_ID}`}>
                    {user?.firstName} {user?.lastName}
                  </Link>
                </td>
                <td>{format(new Date(order.date), "MMM dd,  yyyy")}</td>
                <td>${order.total}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
