import { Swiper, SwiperSlide } from "swiper/react"

import "swiper/css"
import "swiper/css/free-mode"
import "swiper/css/navigation"
import "swiper/css/thumbs"

import AOS from "aos"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { getAPI } from "../utils/fecthData"
import { IComment, IRoom, TypedDispatch } from "../utils/types"
import Feedback from "./Feedback"
import { AiFillStar, AiOutlineStar } from "react-icons/ai"
import {
  FreeMode,
  Navigation,
  Thumbs,
  Zoom,
  Autoplay,
  Pagination
} from "swiper"

export default function Experience({ room }: { room: IRoom }) {
  useEffect(() => {
    AOS.init()
  }, [])

  const dispatch = useDispatch<TypedDispatch>()
  const [comment, setComment] = useState<IComment[]>([])
  useEffect(() => {
    const getComment = async () => {
      await getAPI(`comments/${room.room_ID}`)
        .then((res) => {
          setComment(res.data.data)
        })
        .catch((err) => console.log(err))
    }
    getComment()

    return () => setComment([])
  }, [dispatch])
  const renderStart = (rate?: number) => {
    const stars = []
    const max = 5
    if (rate === undefined) return
    for (let i = 0; i < max; i++) {
      if (i < rate) {
        stars.push(<AiFillStar key={i} className="text-[#FFD700]" />)
      } else {
        stars.push(<AiOutlineStar key={i} className="text-[#FFD700]" />)
      }
    }
    return stars
  }
  return (
    <div className="mx-4" data-aos="fade-up">
      <Swiper
        slidesPerView={3}
        spaceBetween={10}
        freeMode={true}
        pagination={{
          clickable: true
        }}
        modules={[FreeMode, Pagination]}
        className="mySwiper"
      >
        {comment.length > 0 &&
          comment.map((cmt, index) => {
            return (
              <SwiperSlide
                key={index}
                className="swiper-slide flex-col bg-black"
              >
                <div className="pb-12 relative overflow-hidden group">
                  <img
                    src={cmt.image}
                    alt={cmt.createdAt?.toString()}
                    className="group-hover:scale-105 transition-all duration-500 ease-linear group-hover:opacity-[0.85]"
                    style={{
                      backgroundSize: "cover",
                      height: "18rem",
                      width: "100%"
                    }}
                  />
                  <br />

                  <p className="text-left text-lg">{cmt.comment}</p>
                  <div className="flex text-yellow-400 items-center justify-between">
                    <span className="flex">{renderStart(cmt.point)}</span>
                    {cmt?.createdAt?.toString()}
                  </div>
                </div>
              </SwiperSlide>
            )
          })}
      </Swiper>

      <Feedback room={room} />
      <br />
      <br />
      <br />
    </div>
  )
}
