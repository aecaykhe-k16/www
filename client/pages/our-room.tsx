import AOS from "aos"
import Head from "next/head"
import Link from "next/link"
import Footer from "../components/Footer"
import RoomBooking from "../components/RoomBooking"

import BANNER_BOOKING from "../assets/images/roomBooking/banner.jpg"

import { useEffect, useState } from "react"
import { getAPI } from "../utils/fecthData"
import { IRoom } from "../utils/types"
import Header from "../components/Header"
const OurRoom = ({ rooms }: { rooms: IRoom[] }) => {
  useEffect(() => {
    AOS.init()
  }, [])

  const [scrollPosition, setScrollPosition] = useState(0)

  let scroll = 0
  const handleScroll = () => {
    const position = window.pageYOffset
    setScrollPosition(position)
  }

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])
  scroll = scrollPosition / 400
  let opc = 1 - scroll < 0 ? 0 : 1 - scroll

  const useOnScreen = (ref: any) => {
    const [isIntersecting, setIntersecting] = useState(false)
    useEffect(() => {
      const observer = new IntersectionObserver(([entry]) =>
        setIntersecting(entry.isIntersecting)
      )
      if (ref.current) {
        observer.observe(ref.current)
      }
    }, [])
    return isIntersecting
  }
  return (
    <>
      <Head>
        <title>room</title>
      </Head>
      <main>
        <Header />
        <div className="h-screen bg-cover bg-center relative bg-fixed pb-16">
          <img
            src={BANNER_BOOKING.src}
            alt=""
            className="absolute w-full h-full object-cover"
          />
          <div
            className="absolute text-white top-[247px] left-[170px]"
            style={{
              opacity: `${opc}`
            }}
          >
            <h1 className="text-lg font-bold">EXCLUSIVE ENVIRONMENT</h1>
            <p className="font-bold text-7xl w-[450px]">
              DISCOVER OUR ROOMS AND SUITES
            </p>
          </div>
          {/* <Link href="/" className="flex items-center absolute top-4 left-4">
            <img
              src="https://res.cloudinary.com/dkh1ozkvt/image/upload/v1682492921/1_grzzwk.png"
              className="h-10 mr-3 sm:h-9"
              alt="Flowbite Logo"
            />
            <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">
              StarlightHotel
            </span>
          </Link> */}
          {/* <Link
            href="/booking"
            className="flex items-center absolute top-4 right-4"
          >
            <button className="bg-white px-6 py-2 rounded-3xl font-bold">
              BOOK NOW
            </button>
          </Link> */}
        </div>

        {rooms.map((room, index) => {
          return <RoomBooking key={room.room_ID} room={room} position={index} />
        })}
      </main>
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

export default OurRoom
