import { v4 as uuidv4 } from "uuid"

import { useEffect, useState } from "react"
import { MdPayment, MdRemoveShoppingCart } from "react-icons/md"
import { useDispatch, useSelector } from "react-redux"
import { refreshToken } from "../../redux/actions/authAction"
import { getRooms } from "../../redux/actions/roomAction"
import { getUsers } from "../../redux/actions/userAction"
import { useStorage } from "../../utils/hooks"
import {
  ICart,
  IRoomChecked,
  RootStore,
  TypedDispatch
} from "../../utils/types"
import { postAPI } from "../../utils/fecthData"
import { ALERT } from "../../redux/types/alertType"

const Cart = () => {
  const session = useStorage()
  const dispatch = useDispatch<TypedDispatch>()
  const convertDate = (date: Date) => {
    const year = date.getFullYear()
    const month =
      date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
    const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
    return `${year}-${month}-${day}`
  }
  useEffect(() => {
    dispatch(getRooms())
    dispatch(getUsers())
    dispatch(refreshToken())
  }, [dispatch])
  const [isChecked, setIsChecked] = useState(false)
  const [isCheckAll, setIsCheckAll] = useState(false)

  const [cart, setCart] = useState<ICart[]>([])
  const [cartCheckout, setCartCheckout] = useState<ICart[]>([])
  useEffect(() => {
    if (session.getItem("carts", "local") !== undefined) {
      const carts = JSON.parse(session.getItem("carts", "local"))
      setCart(carts)
    }
  }, [])
  const { auth, users } = useSelector((state: RootStore) => state)

  const [roomChecked, setRoomChecked] = useState<IRoomChecked[]>([])

  useEffect(() => {
    const newRoomChecked: IRoomChecked[] = cart.map((item) => ({
      ...item.rooms,
      isChecked: false,
      checkIn: item.checkIn,
      checkOut: item.checkOut
    }))
    setRoomChecked(newRoomChecked)
  }, [cart])
  console.log(roomChecked)

  const handleCheckAll = () => {
    setIsCheckAll(!isCheckAll)
    const newRoomChecked = roomChecked.map((item) => ({
      ...item,
      isChecked: !isCheckAll
    }))
    setRoomChecked(newRoomChecked)
  }
  const handleIsChecked = (id: string) => {
    const newRoomChecked = roomChecked.map((item) => {
      if (item.room_ID === id) {
        item.isChecked = !item.isChecked
      }
      return item
    })

    setRoomChecked(newRoomChecked)
    setIsCheckAll(false)
    roomChecked.forEach((item) => {
      if (item.isChecked) {
        cart.forEach((cartItem) => {
          if (
            cartItem.rooms.room_ID === item.room_ID &&
            !cartCheckout.some(
              (item) => item.rooms.room_ID === cartItem.rooms.room_ID
            )
          ) {
            setCartCheckout((prev) => [...prev, cartItem])
          }
        })
      } else {
        cartCheckout.forEach((cartItem) => {
          if (cartItem.rooms.room_ID === id) {
            setCartCheckout((prev) =>
              prev.filter((item) => item.rooms.room_ID !== id)
            )
          }
        })
      }
    })
  }

  const handlePay = async () => {
    let total = cartCheckout.reduce((prev, item) => {
      return prev + item.rooms.price * item.quantity
    }, 0)

    const checkoutCart = {
      bill_ID: uuidv4(),
      total,
      user_ID: users.find(
        (user) => user.email === auth.data?.user.email && user
      )?.id,
      billDetails: cartCheckout
    }
    dispatch({ type: ALERT, payload: { loading: true } })

    await postAPI("bills/checkout", checkoutCart, auth.data?.accessToken)
      .then((res) => {
        dispatch({ type: ALERT, payload: { loading: false } })
        dispatch({ type: ALERT, payload: { success: res.data.message } })
      })
      .catch((err) => {
        dispatch({ type: ALERT, payload: { loading: false } })
        dispatch({
          type: ALERT,
          payload: {
            errors: err.response.data.message + "you need to login to pay"
          }
        })
      })
    setCart([
      ...cart.filter(
        (item) =>
          !cartCheckout.some(
            (cartItem) => cartItem.rooms.room_ID === item.rooms.room_ID
          )
      )
    ])
  }

  return (
    <div className="relative">
      {/* <div className="h-20 bg-gradient-to-r from-[#B8F6F9] via-[#d3ebf3] to-[#F2DDEC]"></div> */}
      <div className="flex">
        <h1 className="ml-16 text-3xl">My cart</h1>
        <div className="absolute right-64 top-1 flex">
          <div className=" w-6 h-6 border-4 border-[#767676]  rounded-lg flex a">
            <input
              className="w-4 h-4 checked:bg-amber-500"
              type="checkbox"
              name=""
              id="CheckAll"
              checked={isCheckAll}
              onChange={handleCheckAll}
            />
          </div>
          <p className="text-lg">Check all</p>
        </div>
        <button
          className="text-lg flex h-10 w-40 rounded-xl bg-stone-800 text-white justify-center items-center absolute -top-1 right-16"
          onClick={handlePay}
        >
          <MdPayment className="text-xl" />
          Pay now
        </button>
      </div>
      <div className="mt-2 h-[23rem] ml-8 mr-8 mb-12 overflow-y-scroll ">
        {roomChecked.map((item) => (
          <div
            className="mt-4 h-48 bg-white rounded-2xl overflow-hidden flex"
            key={item.room_ID}
          >
            <img
              className="max-h-full w-3/12 object-cover justify-center items-center rounded-2xl"
              src={item.images[0]}
              alt=""
            />
            <div className="block w-3/5 ml-6 relative">
              <div className="mt-2">
                <p className="text-3xl font-medium">{item.roomName}</p>
              </div>
              <div className="mt-2">{item.description.slice(0, 100)}</div>
              <div className="flex mt-4 items-center justify-between absolute bottom-4 left-8">
                <p className="mr-2 mt-0.5">Check in:</p>
                <div className="flex border-2 border-gray-400 rounded-md overflow-hidden h-8">
                  <input
                    className="text-base"
                    type="date"
                    value={new Date(item?.checkIn?.toString())
                      .toISOString()
                      .substring(0, 10)}
                  />
                </div>
                <p className="ml-8 mr-2 mt-0.5">Check out:</p>
                <div className="flex border-2 border-gray-400 rounded-md overflow-hidden h-8">
                  <input
                    className="text-base"
                    type="date"
                    value={new Date(item?.checkOut?.toString())
                      .toISOString()
                      .substring(0, 10)}
                  />
                </div>
                <button className="ml-28 flex p-2 rounded-lg font-medium hover:bg-[#f94c29ca] items-center">
                  <MdRemoveShoppingCart className="text-xl" />
                  Remove
                </button>
              </div>
            </div>
            <div className="float-right">
              <div className="mt-8 ml-10">
                <p className="text-xl font-semibold text-[#86d589]">$10000.0</p>
                <span className="text-base text-slate-400">2 person</span>
              </div>
              <div className=" w-8 h-8 mt-14 ml-16 rounded-lg ">
                <input
                  className="w-6 h-6 checked:bg-amber-500"
                  type="checkbox"
                  name=""
                  id="item"
                  checked={isCheckAll ? true : item.isChecked}
                  onChange={() => handleIsChecked(item.room_ID)}
                  value={item.room_ID}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Cart
