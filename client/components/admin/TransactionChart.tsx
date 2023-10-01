import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts"
import { getAPI } from "../../utils/fecthData"
import { IDataForStatistic, TypedDispatch } from "../../utils/types"

const TransactionChart = () => {
  const dispatch = useDispatch<TypedDispatch>()
  const [dataForStatistic, setDataForStatistic] = useState<IDataForStatistic[]>(
    []
  )

  useEffect(() => {
    getAPI("statistics/getDataOrderByYear")
      .then((res) => {
        console.log(res)
        setDataForStatistic(res.data.data)
      })
      .catch((err) => console.log(err))
  }, [dispatch])

  return (
    <div className="h-[22rem] bg-white p-4 rounded-sm border border-gray-200 flex flex-col flex-1">
      <strong className="text-gray-700 font-medium">Transactions</strong>
      <div className="mt-3 w-full flex-1 text-xs">
        <ResponsiveContainer width="95%" height="100%">
          <BarChart
            width={500}
            height={300}
            data={dataForStatistic}
            margin={{
              top: 20,
              right: 10,
              left: -10,
              bottom: 0
            }}
          >
            <CartesianGrid strokeDasharray="3 3 0 0" vertical={false} />
            <XAxis dataKey="name" />
            <YAxis domain={[0, 1000]} tickCount={10} />
            <Tooltip />
            <Legend />
            <Bar dataKey="income" fill="#0ea5e9" />
            <Bar dataKey="expense" fill="#ea580c" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
export default TransactionChart
