import { format } from "date-fns"
import Link from "next/link"
import { useEffect, useState } from "react"
import { DayPicker } from "react-day-picker"
import { AiFillStar, AiOutlineStar } from "react-icons/ai"
import { FaTimes } from "react-icons/fa"
import { IoMdArrowDropdown } from "react-icons/io"
import { useDispatch } from "react-redux"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"

import { IRoom, TypedDispatch } from "../utils/types"

import { motion } from "framer-motion"
import Head from "next/head"
import { useRouter } from "next/router"
import Footer from "../components/Footer"
import Header from "../components/Header"
import { refreshToken } from "../redux/actions/authAction"
import { ALERT } from "../redux/types/alertType"
import { INCREASE, DECREASE } from "../utils/constant"
import { getAPI } from "../utils/fecthData"

const Booking = ({ rooms }: { rooms: IRoom[] }) => {
  const router = useRouter()
  const search = router.query.search
  const [checkin, setCheckin] = useState<Date>()
  const [toggleCheckIn, setToggleCheckIn] = useState(false)
  const [checkOut, setCheckOut] = useState<Date>()
  const [toggleCheckOut, setToggleCheckOut] = useState(false)

  const [active, setActive] = useState(0)

  const [fillterRoom, setFillterRoom] = useState<IRoom[]>(rooms)
  const [room, setRoom] = useState<IRoom[]>()

  const genarateStar = (star: number) => {
    const stars = []
    for (let i = 0; i < star; i++) {
      stars.push(
        <AiFillStar className="text-yellow-400 inline-block" key={i} />
      )
    }
    if (star < 5)
      for (let i = 0; i < 5 - star; i++) {
        stars.push(
          <AiOutlineStar className="text-yellow-400 inline-block" key={5 - i} />
        )
      }
    return stars
  }

  const dispatch = useDispatch<TypedDispatch>()

  useEffect(() => {
    if (active === 0) {
      setFillterRoom(rooms)
      router.push(`/booking`)
    }
    if (active === 1) {
      setFillterRoom(rooms.sort((a, b) => a.price - b.price))
      router.push(`/booking?sort=${INCREASE}`)
    } else if (active === 2) {
      setFillterRoom(rooms.sort((a, b) => b.price - a.price))
      router.push(`/booking?sort=${DECREASE}`)
    }
  }, [active])

  useEffect(() => {
    if (search) {
      setFillterRoom(
        rooms.filter((room) =>
          room.roomName.toLowerCase().includes(search.toString().toLowerCase())
        )
      )
      if (fillterRoom.length == 0) setFillterRoom(rooms)
    }
  }, [search])

  useEffect(() => {
    dispatch(refreshToken())
  }, [dispatch])

  const handleCheckDate = async () => {
    if (!checkin || !checkOut) return
    if (checkin.getTime() > checkOut.getTime()) {
      dispatch({ type: ALERT, payload: { errors: "Checkin > checkout" } })
    }
    const checkInFormat = `${checkin.getFullYear()}-${
      checkin.getMonth() < 10 ? "0" + checkin.getMonth() : checkin.getMonth()
    }-${checkin.getDate() < 10 ? "0" + checkin.getDate() : checkin.getDate()}`
    const checkOutFormat = `${checkOut.getFullYear()}-${
      checkOut.getMonth() < 10 ? "0" + checkOut.getMonth() : checkOut.getMonth()
    }-${
      checkOut.getDate() < 10 ? "0" + checkOut.getDate() : checkOut.getDate()
    }`
    try {
      const res = await getAPI(
        `rooms/getByDate?checkIn=${checkInFormat}&checkOut=${checkOutFormat}`
      )
      setRoom(res.data.data)
      if (room) {
        setFillterRoom(room)
      }
    } catch (err) {
      console.log(err)
    }
    router.push(`/booking`)
  }

  return (
    <>
      <Head>
        <title>Booking</title>
      </Head>

      <Header />
      <div className="ml-40 mr-20 flex space-x-8 pt-24">
        <div className="space-y-5 w-1/4">
          <h1 className="text-2xl text-[#0c0c0c] font-medium">
            Check Availability
          </h1>

          <div className=" w-64 bg-[#F5F5F5] p-4 rounded-lg relative">
            <span>Check In</span>
            <div
              className="flex justify-between items-center cursor-pointer relative"
              onClick={() => {
                setToggleCheckIn(!toggleCheckIn)
                setToggleCheckOut(false)
              }}
            >
              <p className="font-bold">
                {checkin
                  ? format(new Date(checkin), "MMM dd, yyyy")
                  : "Select date"}
              </p>
              <IoMdArrowDropdown />
            </div>
            {toggleCheckIn && (
              <div className="bg-[#f5f5f5] absolute  top-[calc(100%+20px)] -left-7 w-[calc(100%+70px)] rounded-lg shadow-2xl picker z-50">
                <FaTimes
                  className="float-right my-2 mr-2 font-bold text-base cursor-pointer"
                  onClick={() => {
                    setToggleCheckIn(!toggleCheckIn)
                    setToggleCheckOut(false)
                  }}
                />
                <DayPicker
                  mode="single"
                  selected={checkin}
                  onSelect={setCheckin}
                  className="mx-4"
                />
              </div>
            )}
          </div>
          <div className="h-[86x] w-64 bg-[#F5F5F5] p-4 rounded-lg relative">
            <span>Check Out</span>
            <div
              className="flex justify-between items-center cursor-pointer relative"
              onClick={() => {
                setToggleCheckOut(!toggleCheckOut)
                setToggleCheckIn(false)
              }}
            >
              <p className="font-bold">
                {checkOut
                  ? format(new Date(checkOut), "MMM dd, yyyy")
                  : "Select date"}
              </p>
              <IoMdArrowDropdown />
            </div>
            {toggleCheckOut && (
              <div className="bg-[#f5f5f5] absolute  top-[calc(100%+20px)] -left-7 w-[calc(100%+70px)] rounded-lg shadow-2xl picker z-50">
                <FaTimes
                  className="float-right m-2 font-bold text-base cursor-pointer"
                  onClick={() => {
                    setToggleCheckOut(!toggleCheckOut)
                    setToggleCheckIn(false)
                  }}
                />
                <DayPicker
                  mode="single"
                  selected={checkOut}
                  onSelect={setCheckOut}
                  className="mx-4"
                />
              </div>
            )}
          </div>

          <button
            className="bg-transparent font-bold py-2 px-4 mt-8 border-black rounded w-64 border-2"
            onClick={handleCheckDate}
          >
            SEARCH ROOM
          </button>
        </div>
        <div className="w-3/4">
          <div className="flex">
            <h1>Fillter</h1>
            <ul className="flex space-x-4 ml-4">
              <li
                className={`rounded-lg border border-gray-500 hover:bg-black transition-colors hover:text-white px-4 mb-6 cursor-pointer ${
                  active === 1 && "bg-black text-white"
                }`}
                onClick={() => setActive(1)}
              >
                Increase
              </li>
              <li
                className={`rounded-lg border border-gray-500 hover:bg-black transition-colors hover:text-white px-4 mb-6 cursor-pointer ${
                  active === 2 && "bg-black text-white"
                }`}
                onClick={() => setActive(2)}
              >
                Decrease
              </li>
              {/* {active > 0 && (
                <li
                  className={`rounded-lg border border-gray-500 hover:bg-red-600 transition-colors hover:text-white px-4 mb-6 cursor-pointer `}
                  onClick={() => setActive(0)}
                >
                  Remove filter
                </li>
              )} */}
            </ul>
          </div>
          <motion.div layout className="grid grid-cols-2 h-fit gap-4">
            {fillterRoom.length !== 0 &&
              fillterRoom.map((item) => (
                <motion.div
                  layout
                  animate={{ opacity: 1 }}
                  initial={{ opacity: 0 }}
                  exit={{ opacity: 0 }}
                  className="rounded-lg flex shadow-md border pr-1 overflow-hidden"
                >
                  <img
                    src={item.images[0]}
                    alt={item.description}
                    className="h-full w-28 object-cover mr-3"
                  />
                  <div className="w-full">
                    <h1 className="font-medium ">{item.roomName}</h1>
                    {genarateStar(item.vote)}
                    <span className="ml-2">{item.vote} reviews</span>
                    <div className="mt-4 py-4 flex justify-between">
                      <button className="bg-transparent font-medium relative group">
                        <Link href={`room/${item.room_ID}`}>BOOK NOW</Link>
                        <div
                          className="w-0 group-hover:w-full h-[2px] bg-gray-400 absolute top-full"
                          style={{ transition: "all 0.3s ease-in-out" }}
                        ></div>
                      </button>
                      <p className="">
                        <span className="line-through text-sm font-semibold">
                          ${(item.price / (1 - 20 / 100)).toFixed(2)}
                        </span>
                        {"  "}
                        <span className="font-medium text-xl ">
                          ${item.price.toFixed(2)}
                        </span>
                        <span className="text-[#949494] text-base">
                          / night
                        </span>
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
          </motion.div>
        </div>
      </div>
      <br />
      <br />
      <br />
      <Footer />
    </>
  )
}
export const getStaticProps = async () => {
  const res = await getAPI("rooms")
  const rooms: IRoom[] = res.data.data
  return {
    props: {
      rooms
    }
  }
}
export default Booking
