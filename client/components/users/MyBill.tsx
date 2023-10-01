import { BsFillCalendarCheckFill } from "react-icons/bs"
import { MdRefresh } from "react-icons/md"
import { useDispatch, useSelector } from "react-redux"
import { IBillDetail, RootStore, TypedDispatch } from "../../utils/types"
import { useEffect, useState } from "react"
import { getAPI } from "../../utils/fecthData"
import Link from "next/link"

const MyBill = () => {
  const dispatch = useDispatch<TypedDispatch>()
  const [billDetail, setBillDetail] = useState<IBillDetail[]>([])
  const { auth, rooms } = useSelector((state: RootStore) => state)
  useEffect(() => {
    const fectData = async () => {
      const res = await getAPI(
        `bills/billOfUser?email=${auth.data?.user.email}`
      )
      setBillDetail(res.data.data)
    }
    if (auth.data?.accessToken) fectData()
  }, [dispatch, auth.data?.accessToken])

  return (
    <div className="">
      <h1 className="ml-16 text-3xl">My bill</h1>
      <div className="overflow-y-scroll h-96 ml-8 mr-8 ">
        {billDetail.length > 0 &&
          billDetail.map((item) => {
            const room = rooms.find((room) => room.room_ID === item.room_ID)
            return (
              <div className=" bg-white border-2 shadow-xl rounded-xl overflow-hidden flex mt-4 relative">
                <img
                  src={room?.images[0]}
                  alt=""
                  className="h-52 w-80 object-cover"
                />
                <div className=" relative">
                  <div className="flex">
                    <div className="ml-8 mt-2 w-3/4 ">
                      <div className="text-3xl font-medium">
                        {room?.roomName}
                      </div>
                      <div className="text-base font-normal mt-2">
                        {room?.description}
                      </div>
                    </div>
                    <div className="w-40 ml-4 flex-col">
                      <div className="block text-center">
                        <p className="mt-4 line-through font-light text-slate-500">
                          ${room?.price + 200}
                        </p>
                        <p className=" text-2xl font-medium text-green-500">
                          $ {room?.price + 200}
                        </p>
                        <p className="text-sm font-medium text-slate-500">
                          {room?.limitQuantity} person
                        </p>
                      </div>
                      <div className="absolute block bottom-4 right-10">
                        <Link href={`/room/${room?.room_ID}`}>
                          <button className="bg-blue-400 h-10 ml-6 flex p-2 rounded-lg font-medium hover:bg-blue-300 justify-center items-center">
                            <MdRefresh className="text-base mr-1" />
                            ReOrder
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="flex absolute bottom-4">
                    <div className="flex ml-24 mt-2">
                      <p className="flex text-lg">
                        <BsFillCalendarCheckFill className="mt-1 mr-1 " />
                        Check in: {item.check_in.toString()}
                      </p>
                      <p className="flex text-lg ml-16">
                        <BsFillCalendarCheckFill className="mt-1 mr-1" />
                        Check out: {item.check_out.toString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
      </div>
    </div>
  )
}

export default MyBill
