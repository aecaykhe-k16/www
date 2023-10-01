import { GetStaticPaths, GetStaticProps } from "next"
import Head from "next/head"
import { ParsedUrlQuery } from "querystring"
import { useEffect, useState } from "react"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import BookNow from "../../components/BookNow"
import Experience from "../../components/Experience"
import Footer from "../../components/Footer"
import Header from "../../components/Header"
import Loading from "../../components/alter/Loading"
import { getAPI, getID } from "../../utils/fecthData"
import { IRoom } from "../../utils/types"

const RoomDetail = ({ room }: { room: IRoom }) => {
  let scroll = 0

  const [scrollPosition, setScrollPosition] = useState(0)
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
  setTimeout(() => {
    return <Loading />
  }, 3000)
  return (
    <>
      <Head>
        <title>{room.roomName}</title>
      </Head>
      <main>
        <Header />
        <div key={room.room_ID} className="pt-16">
          <div className="h-screen bg-cover bg-center relative bg-fixed">
            <img
              src={room.images[0]}
              alt=""
              className="absolute w-full h-full object-cover"
            />
            <div
              className={`absolute text-white top-[247px] left-[170px]`}
              style={{
                opacity: `${opc}`
              }}
            >
              <h1 className="text-lg font-bold">EXCLUSIVE ENVIRONMENT</h1>
              <p className="font-bold text-7xl w-[450px]">
                DISCOVER OUR ROOMS AND SUITES
              </p>
            </div>
          </div>

          <BookNow room={room} />

          <div className="relative py-[100px] bg-black text-white border-b border-white">
            <div className="pl-44 mt-4">
              <div className="absolute top-36 left-24 w-14 h-[6px] bg-white"></div>
              <h1 className="font-semibold text-[50px] leading-tight">
                DISCOVER EXPRERIENCE
              </h1>

              <br />
              <br />
            </div>
            <Experience room={room} />
          </div>
          <Footer />
        </div>
      </main>
    </>
  )
}
interface IParams extends ParsedUrlQuery {
  slug: string
}

export const getStaticPaths: GetStaticPaths = async () => {
  const arr: IRoom[] = await (await getAPI("rooms")).data.data
  const paths = arr.map((room: IRoom) => {
    return {
      params: { slug: room.room_ID.toString() }
    }
  })
  return { paths, fallback: false }
}

export const getStaticProps: GetStaticProps = async (context) => {
  const { slug } = context.params as IParams
  const room: IRoom = await (await getID("rooms", slug)).data.data
  return {
    props: {
      room
    }
  }
}
export default RoomDetail
