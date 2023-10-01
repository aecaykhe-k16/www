import React, { useEffect, useState } from "react"
import { IoBagHandle, IoCart, IoPeople, IoPieChart } from "react-icons/io5"
import { useDispatch } from "react-redux"
import { getAPI } from "../../utils/fecthData"
import { TypedDispatch } from "../../utils/types"

import { ALERT } from "../../redux/types/alertType"
import { animated, useSpring } from "react-spring"

const DashboardStatsGrid = () => {
  const convertDate = (date: Date) => {
    const year = date.getFullYear()
    const month =
      date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
    const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
    return `${year}-${month}-${day}`
  }
  const increaseNumber = (n: number) => {
    const { number } = useSpring({
      from: { number: 0 },
      number: n,
      delay: 0,
      config: { mass: 1, tension: 20, friction: 10 }
    })
    return <animated.div>{number.to((n) => n.toFixed(0))}</animated.div>
  }

  const dispatch = useDispatch<TypedDispatch>()
  const [totalSales, setTotalSales] = useState<number>(0)
  const [totalExpense, setTotalExpense] = useState<number>(0)
  const [totalCustomer, setTotalCustomer] = useState<number>(0)
  const [totalOrder, setTotalOrder] = useState<number>(0)
  const [startDate, setStartDate] = useState<string>("mm/dd/YYYY")
  const [endDate, setEndDate] = useState<string>("mm/dd/YYYY")
  const defaultStartDate = "2021-01-01"
  const defaultEndDate = "2023-12-31"

  useEffect(() => {
    getAPI(
      `statistics/totalSales?dateFrom=${defaultStartDate}&dateTo=${defaultEndDate}`
    )
      .then((res) => {
        setTotalSales(res.data.data)
      })
      .catch((err) => console.log(err))
  }, [])

  useEffect(() => {
    getAPI(
      `statistics/totalExpense?dateFrom=${defaultStartDate}&dateTo=${defaultEndDate}`
    )
      .then((res) => {
        setTotalExpense(res.data.data)
      })
      .catch((err) => console.log(err))
  }, [])

  useEffect(() => {
    getAPI(
      `statistics/totalCustomer?dateFrom=${defaultStartDate}&dateTo=${defaultEndDate}`
    )
      .then((res) => {
        setTotalCustomer(res.data.data)
      })
      .catch((err) => console.log(err))
  }, [])

  useEffect(() => {
    getAPI(
      `statistics/totalOrder?dateFrom=${defaultStartDate}&dateTo=${defaultEndDate}`
    )
      .then((res) => {
        setTotalOrder(res.data.data)
      })
      .catch((err) => console.log(err))
  }, [])

  useEffect(() => {
    getAPI(`statistics/totalSales?dateFrom=${startDate}&dateTo=${endDate}`)
      .then((res) => {
        setTotalSales(res.data.data)
      })
      .catch((err) => console.log(err))
    getAPI(`statistics/totalExpense?dateFrom=${startDate}&dateTo=${endDate}`)
      .then((res) => {
        setTotalExpense(res.data.data)
      })
      .catch((err) => console.log(err))
    getAPI(`statistics/totalCustomer?dateFrom=${startDate}&dateTo=${endDate}`)
      .then((res) => {
        setTotalCustomer(res.data.data)
      })
      .catch((err) => console.log(err))
    getAPI(`statistics/totalOrder?dateFrom=${startDate}&dateTo=${endDate}`)
      .then((res) => {
        setTotalOrder(res.data.data)
      })
      .catch((err) => console.log(err))
  }, [endDate, startDate])
  return (
    <div>
      <div className="w-full pt-1 pb-14">
        <div className="float-right">
          <span className="font-medium text-lg">Start date:</span>
          <input
            type="date"
            className="border-2 rounded-md p-1 pr-2 pl-2 ml-2"
            value={startDate}
            onChange={(e) =>
              setStartDate(convertDate(new Date(e.target.value)))
            }
          />
          <span className="font-medium text-lg ml-8">End date:</span>
          <input
            type="date"
            className="border-2 rounded-md p-1 pr-2 pl-2 ml-2"
            value={endDate}
            onChange={(e) => {
              if (new Date(e.target.value) < new Date(startDate))
                dispatch({
                  type: ALERT,
                  payload: {
                    errors: "End date must be greater than start date"
                  }
                })
              else setEndDate(convertDate(new Date(e.target.value)))
            }}
          />
        </div>
      </div>
      <div className="flex clear-both">
        <BoxWrapper>
          <div className="rounded-full h-12 w-12 flex items-center justify-center bg-sky-500">
            <IoBagHandle className="text-2xl text-white" />
          </div>
          <div className="pl-4">
            <span className="text-sm text-gray-500 font-light">
              Total Sales
            </span>
            <div className="flex items-center">
              <span className="text-xl text-gray-700 font-semibold flex">
                ${increaseNumber(totalSales)}
              </span>
            </div>
          </div>
        </BoxWrapper>
        <BoxWrapper>
          <div className="rounded-full h-12 w-12 flex items-center justify-center bg-orange-600">
            <IoPieChart className="text-2xl text-white" />
          </div>
          <div className="pl-4 w-40 ">
            <span className="text-sm text-gray-500 font-light">
              Total Expenses
            </span>
            <div className="">
              <span className="text-xl text-gray-700 font-semibold flex">
                ${increaseNumber(totalExpense)}
              </span>
            </div>
          </div>
        </BoxWrapper>
        <BoxWrapper>
          <div className="rounded-full h-12 w-12 flex items-center justify-center bg-yellow-400">
            <IoPeople className="text-2xl text-white" />
          </div>
          <div className="pl-4">
            <span className="text-sm text-gray-500 font-light">
              Total Customers
            </span>
            <div className="flex items-center">
              <strong className="text-xl text-gray-700 font-semibold flex">
                {increaseNumber(totalCustomer)}
              </strong>
            </div>
          </div>
        </BoxWrapper>
        <BoxWrapper>
          <div className="rounded-full h-12 w-12 flex items-center justify-center bg-green-600">
            <IoCart className="text-2xl text-white" />
          </div>
          <div className="pl-4">
            <span className="text-sm text-gray-500 font-light">
              Total Orders
            </span>
            <div className="flex items-center">
              <strong className="text-xl text-gray-700 font-semibold flex">
                {increaseNumber(totalOrder)}
              </strong>
            </div>
          </div>
        </BoxWrapper>
      </div>
    </div>
  )
}

interface BoxWrapperProps {
  children: React.ReactNode
}

function BoxWrapper({ children }: BoxWrapperProps) {
  return (
    <div className="bg-white rounded-sm p-4  w-full border border-gray-200 flex items-center">
      {children}
    </div>
  )
}
export default DashboardStatsGrid
