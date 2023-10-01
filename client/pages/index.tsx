import Image from "next/image"

import type { NextPage } from "next"
import Head from "next/head"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Autoplay, FreeMode, Navigation, Thumbs, Zoom } from "swiper"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import { Swiper, SwiperSlide } from "swiper/react"
import { IDataForStatistic, IRoom, IRoomOfRoomType } from "../utils/types"

import AOS from "aos"
import BAR from "../assets/images/bar.jpg"
import FITNESS from "../assets/images/fitness.jpg"
import { RootStore, TypedDispatch } from "../utils/types"

import Footer from "../components/Footer"
import Header from "../components/Header"

import { AiFillStar, AiOutlineStar } from "react-icons/ai"
import { listFacilities, listServices } from "../components/Services"
import { refreshToken } from "../redux/actions/authAction"
import { getRooms } from "../redux/actions/roomAction"
import { getUsers } from "../redux/actions/userAction"
import { getAPI } from "../utils/fecthData"
import { useStorage } from "../utils/hooks"

import { animated, useSpring } from "react-spring"
import { getComments } from "../redux/actions/commentAction"

const Home: NextPage = () => {
  const renderStart = (rate: number) => {
    const stars = []
    const max = 5
    for (let i = 0; i < max; i++) {
      if (i < rate) {
        stars.push(<AiFillStar key={i} className="text-[#FFD700]" />)
      } else {
        stars.push(<AiOutlineStar key={i} className="text-[#FFD700]" />)
      }
    }
    return stars
  }
  const dispatch = useDispatch<TypedDispatch>()

  const [dataForStatistic, setDataForStatistic] = useState<IDataForStatistic[]>(
    []
  )

  const session = useStorage()
  useEffect(() => {
    AOS.init()
  }, [])
  const [roomOfRoomType, setRoomOfRoomType] = useState<IRoomOfRoomType[]>([])

  const [banner, setBanner] = useState<IRoom[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [currentRoom, setCurrentRoom] = useState<IRoom>({} as IRoom)

  useEffect(() => {
    const getRoomPopular = async () => {
      await getAPI("roomTypes/getRoomsOfRoomType")
        .then((res) => {
          setRoomOfRoomType(res.data.data)
        })
        .catch((err) => console.log(err))
    }
    getRoomPopular()
    return () => setRoomOfRoomType([])
  }, [])
  const roomMapper: { id: string; image: string }[] = roomOfRoomType.map(
    (room) => {
      const newMapper = {
        id: room.type_ID,
        image: room.rooms.map((r) => r.images[0]).shift() as string
      }
      return newMapper
    }
  )

  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null)
  useEffect(() => {
    dispatch(getRooms())
    dispatch(getUsers())
    dispatch(refreshToken())
    dispatch(getComments())
  }, [dispatch])
  const { rooms, auth } = useSelector((state: RootStore) => state)
  const handleSlideChange = (swiper: any) => {
    const realIndex = swiper.realIndex
    if (
      realIndex >= 0 &&
      realIndex <= roomMapper.length &&
      currentIndex !== realIndex
    ) {
      setCurrentIndex(realIndex)
    }
  }

  useEffect(() => {
    const room = roomMapper[currentIndex]
    if (room) {
      const current = roomOfRoomType.find((r) => r.type_ID === room.id)
      setCurrentRoom(current?.rooms[0] as IRoom)
    }
    return () => setCurrentRoom({} as IRoom)
  }, [currentIndex])

  const increaseNumber = (n: number) => {
    const { number } = useSpring({
      from: { number: 0 },
      number: n,
      delay: 200,
      config: { mass: 1, tension: 20, friction: 10 }
    })
    return <animated.div>{number.to((n) => n.toFixed(0))}</animated.div>
  }

  return (
    <>
      <Head>
        <title>HOME</title>
      </Head>

      <main>
        <Header />
        <div className="h-screen w-full relative bg-black">
          <img
            src="https://res.cloudinary.com/dkh1ozkvt/image/upload/v1682489973/minh-luu-minhluu-com-aa-photography-XZHK8gR1xh4-unsplash_un4xag.jpg"
            alt=""
            className="h-full w-full object-cover opacity-50"
          />
          <i className="absolute top-[38%] left-[69%]  font-bold text-xl text-white text-end">
            STAY WITH US FEEL LIKE HOME
          </i>
          <i className="absolute top-1/2 left-1/2 -translate-x-1/4 -translate-y-1/2 font-bold text-4xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-cyan-300 to-cyan-400 text-end">
            Welcome to our Starlight Hotel, where exceptional service and
            luxurious amenities await you.
          </i>
        </div>

        <div className="grid grid-cols-2">
          <div className="h-96 p-16 relative pl-32" data-aos="fade-left">
            <div className="absolute top-24 left-10 w-14 h-2 bg-black"></div>
            <h1 className="font-bold text-6xl">OUR</h1>
            <h1 className="font-bold text-6xl">HISTORY</h1>
            <br />
            <p className="text-lg">
              The Hotel Starlight Hanoi is a historic hotel located in the heart
              of Hanoi, Vietnam. It was first built in 1901 by French investors,
              and has since undergone several renovations and expansions. During
              the Vietnam War, the hotel was used as a residence for foreign
              correspondents, and served as a meeting place for diplomats and
              politicians.
            </p>
            <br />
            <p className="text-lg">
              Today, the Hotel Starlight Hanoi is a five-star luxury hotel that
              blends colonial charm with modern amenities. It features 364 guest
              rooms, several restaurants and bars, a swimming pool, and a spa.
              The hotel has received numerous awards and accolades for its
              outstanding service and elegant ambiance.
            </p>
            <br />
            <p className="text-lg">
              The Hotel Starlight Hanoi is not only a testament to Vietnam's
              rich colonial history, but also a symbol of the country's rapid
              modernization and development. It remains a popular destination
              for tourists and business travelers alike, attracting visitors
              from around the world with its unique blend of old-world charm and
              contemporary luxury.
            </p>
          </div>
          <div
            className="bg-[#f0f0f0] flex flex-col justify-center py-32 px-24 z-10"
            data-aos="fade-right"
          >
            <img
              src="https://res.cloudinary.com/dkh1ozkvt/image/upload/v1676814066/www/two-laughing-guests-checking-in-together-at-a-hote-MUXSSNK_iwkeey.jpg"
              alt=""
              width={900}
              height={1000}
              className="object-cover -mt-48 z-10 border-8 border-white"
            />
            <ul className="flex justify-evenly mt-4">
              <li className="mx-auto">
                <h1 className="text-6xl text-gray-400 font-extrabold text-center">
                  {increaseNumber(rooms.length)}
                </h1>
                <span className="font-semibold">HOTEL ROOMS</span>
              </li>
              <li className="mx-auto">
                <h1 className="text-6xl text-gray-400 font-extrabold text-center">
                  {increaseNumber(rooms.length)}
                </h1>
                <span className="font-semibold">ACTIVITIES</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="pt-[50px] pb-[50px] bg-[#f0f0f0]" data-aos="fade-up">
          <div className="flex justify-around relative">
            <div className="-ml-32">
              <div className="absolute top-8 left-28 w-14 h-[6px] bg-black"></div>
              <h1 className="font-semibold text-[55px] leading-none">
                OUR ROOMS
              </h1>
              <h1 className="font-semibold text-[55px] leading-none">
                AND SUITES
              </h1>
            </div>
            <Link href={`/our-room`}>
              <button className="bg-transparent text-black font-semibold  py-5 px-10 mt-8 border border-black hover:-translate-y-2 transition-transform duration-200 ease-linear block mb-3 -mr-32">
                VIEW ALL ROOMS
              </button>
            </Link>
          </div>
          <Swiper
            slidesPerView={2}
            spaceBetween={50}
            freeMode={true}
            modules={[FreeMode]}
            className="mySwiper mt-16"
          >
            {rooms.map((room) => {
              return (
                <SwiperSlide
                  key={room.room_ID}
                  className="swiper-slide flex-col bg-[#f0f0f0] overflow-hidden"
                >
                  <div className="relative group bg-black overflow-hidden">
                    <Link
                      href={`room/${room.room_ID}`}
                      className="
                      hidden
                      group-hover:inline-block
                      group-hover:absolute
                      group-hover:bg-transparent group-hover:hover:bg-white group-hover:text-white group-hover:font-semibold group-hover:hover:text-black group-hover:py-2 group-hover:px-4  group-hover:border group-hover:border-white group-hover:hover:border-transparent group-hover:rounded
                      group-hover:transition-all group-hover:duration-500 group-hover:ease-in-out
                      group-hover:z-10
                      group-hover:top-[45%] group-hover:left-1/2 group-hover:-translate-x-1/2 group-hover:-translate-y-2/3
                      "
                    >
                      Book now
                    </Link>
                    <div className="overflow-hidden">
                      <img
                        src={room.images[0]}
                        alt={room.description}
                        className=" h-10 w-10 bg-cover transition-all duration-500 ease-in-out
                      group-hover:scale-110 group-hover:opacity-40"
                      />
                    </div>
                    <ul className="flex justify-between bg-white w-full px-4">
                      <li className="text-left">
                        <h1 className="font-semibold text-4xl mb-1 italic">
                          {room.roomName}
                        </h1>
                        <span>
                          {room.acreage} m2 / {room.limitQuantity} persons
                        </span>
                      </li>
                      <li className="text-right">
                        <span>from</span>
                        <h1 className="font-bold text-4xl">$ {room.price}</h1>
                      </li>
                    </ul>
                  </div>
                </SwiperSlide>
              )
            })}
          </Swiper>
          <br />
          <br />
        </div>
        <div className="py-24 pb-14 grid grid-cols-9 bg-[#11171B]">
          <div
            className="col-span-5 flex flex-col relative"
            data-aos="fade-left"
          >
            <div className="pl-44 mb-16">
              <div className="absolute top-6 left-24 w-14 h-1 bg-white"></div>
              <h1 className="text-white text-5xl font-bold mb-2">THE GRAND</h1>
              <h1 className="text-white text-5xl font-bold">REGIONS</h1>
            </div>
            {roomMapper && (
              <div>
                <Swiper
                  onSlideChange={handleSlideChange}
                  loop={true}
                  zoom={true}
                  spaceBetween={10}
                  autoplay={{
                    delay: 3000,
                    disableOnInteraction: false
                  }}
                  thumbs={{
                    swiper:
                      thumbsSwiper && !thumbsSwiper.destroyed
                        ? thumbsSwiper
                        : null
                  }}
                  modules={[FreeMode, Navigation, Thumbs, Zoom, Autoplay]}
                  className="mySwiper2-1"
                >
                  {roomMapper.map((item, index) => {
                    return (
                      <SwiperSlide key={index}>
                        <img src={item.image} alt={item.image} />
                      </SwiperSlide>
                    )
                  })}
                </Swiper>
                <Swiper
                  onSwiper={setThumbsSwiper as any}
                  loop={true}
                  spaceBetween={10}
                  autoplay={{
                    delay: 3000,
                    disableOnInteraction: false
                  }}
                  slidesPerView={roomMapper.length}
                  freeMode={true}
                  watchSlidesProgress={true}
                  modules={[FreeMode, Navigation, Thumbs, Autoplay]}
                  className="mySwiper-1"
                >
                  {roomMapper.map((item, index) => {
                    return (
                      <SwiperSlide key={index}>
                        <img src={item.image} alt={item.image} />
                      </SwiperSlide>
                    )
                  })}
                </Swiper>
              </div>
            )}
          </div>
          <div
            className="h-96 p-12 pt-36 relative pl-18 col-span-4 w-11/12"
            data-aos="fade-right"
          >
            <Swiper className="mySwiper" allowTouchMove={false}>
              {rooms.map((_) => {
                const room = rooms.find(
                  (r) => r.room_ID === currentRoom.room_ID
                )

                if (room)
                  return (
                    <SwiperSlide className="relative flex flex-col bg-[#11171B]">
                      <h1>&nbsp;</h1>
                      <h1>&nbsp;</h1>
                      <h1>&nbsp;</h1>
                      <h1>&nbsp;</h1>
                      <h1>&nbsp;</h1>
                      <h1>&nbsp;</h1>
                      <h1>&nbsp;</h1>
                      <h1>&nbsp;</h1>
                      <h1>&nbsp;</h1>
                      <h1>&nbsp;</h1>
                      <h1>&nbsp;</h1>
                      <h1>&nbsp;</h1>
                      <h1>&nbsp;</h1>
                      <div className="absolute bg-[#11171B] w-full h-56 text-white text-start left-0 top-0">
                        <table className="">
                          <tbody>
                            <tr>
                              <td className="w-40">Name:</td>
                              <td>{room.roomName}</td>
                            </tr>
                            <tr>
                              <td>Services:</td>
                              <td>
                                {room.services?.map((s, index, array) =>
                                  index === array.length - 2
                                    ? s.concat(", ")
                                    : s.concat(" ")
                                )}
                              </td>
                            </tr>
                            <tr className="w-full">
                              <td>Limit people:</td>
                              <td>{room.limitQuantity}</td>
                            </tr>
                            <tr className="">
                              <td>Vote:</td>
                              <td className="flex flex-row items-center">
                                {renderStart(room.vote)}
                                &ensp;
                              </td>
                            </tr>
                            <tr>
                              <td>Price:</td>
                              <td>{room.price}</td>
                            </tr>
                            <tr>
                              <td colSpan={2}>{room.description}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </SwiperSlide>
                  )
              })}
            </Swiper>

            <button className="bg-transparent text-white font-semibold  py-4 px-8 mt-8 border border-white rounded hover:-translate-y-2 transition-transform duration-200 ease-linear uppercase block mb-3">
              <Link href={`room/${currentRoom.room_ID}`}>book now</Link>
            </button>
            <span className="text-white font-bold text-base">
              CALL 41 (0)54 2344 00
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2">
          <div
            className="py-16 relative bg-[#f0f0f0] pb-24"
            data-aos="fade-left"
          >
            <div className="pl-40 mb-48">
              <div className="absolute top-24 left-24 w-14 h-[6px] bg-black"></div>
              <h1 className="font-semibold text-[55px] leading-none">
                SERVICES AND FACILITIES
              </h1>
            </div>
            <br />
            <br />
            <br />
            <div className="relative">
              <Image
                src={BAR}
                alt=""
                width={900}
                height={1000}
                className="object-cover -mt-48 w-full"
              />
              <Image
                src={FITNESS}
                alt=""
                width={300}
                height={400}
                className="object-cover absolute -bottom-10 right-24 border-4 animate-upto"
              />
            </div>
          </div>
          <div
            className="flex flex-col pt-[100px] pr-[80px] pl-[90px]"
            data-aos="fade-right"
          >
            <p className="text-lg">
              Our hotel offers comfortable and luxurious accommodations with
              top-notch amenities and exceptional service. Whether you're
              traveling for business or pleasure, we strive to provide an
              unforgettable experience to our guests. Contact us today to learn
              more about our services and book your stay.
            </p>
            <ul className="grid grid-cols-4 mt-[40px]">
              {listServices.map((service) => {
                return (
                  <li
                    key={service.id}
                    className="flex flex-col items-center mb-6"
                  >
                    {service.icon}

                    <span className="text-base text-center">
                      {service.name}
                    </span>
                  </li>
                )
              })}
              {listFacilities.map((facility) => {
                return (
                  <li
                    key={facility.id}
                    className="flex flex-col items-center mb-6"
                  >
                    {facility.icon}

                    <span className="text-base text-center">
                      {facility.name}
                    </span>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>

        <Footer />
      </main>
    </>
  )
}

export default Home
