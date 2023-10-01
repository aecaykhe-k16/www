/* eslint-disable react-hooks/exhaustive-deps */
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useStorage } from "../utils/hooks"

import { v4 as uuidv4 } from "uuid"

import { ICart, RootStore, TypedDispatch } from "../utils/types"
import { ALERT } from "../redux/types/alertType"
import { postAPI } from "../utils/fecthData"

const API = "IklDGdI-QyOhnknSIY6w3ejoHuVBhNAWcqqHV9hmM2w"

interface IProps {
  open: boolean
  setOpen: (open: boolean) => void
}

const Cart = ({ open, setOpen }: IProps) => {
  const session = useStorage()
  const dispatch = useDispatch<TypedDispatch>()

  const [cart, setCart] = useState<ICart[]>([])
  useEffect(() => {
    if (session.getItem("carts", "local") !== undefined) {
      const carts = JSON.parse(session.getItem("carts", "local"))
      setCart(carts)
    }
  }, [open])

  const { auth, users } = useSelector((state: RootStore) => state)

  const checkout = async () => {
    let total = cart.reduce((prev, item) => {
      return prev + item.rooms.price * item.quantity
    }, 0)

    const checkoutCart = {
      bill_ID: uuidv4(),
      total,
      user_ID: users.find(
        (user) => user.email === auth.data?.user.email && user
      )?.id,
      billDetails: cart
    }
    dispatch({ type: ALERT, payload: { loading: true } })
    await postAPI("bills/checkout", checkoutCart, auth.data?.accessToken)
      .then((res) => {
        dispatch({ type: ALERT, payload: { loading: false } })
        dispatch({ type: ALERT, payload: { success: res.data.message } })
        setCart([])
        session.removeItem("carts", "local")
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
  }

  return (
    <>
      <div
        className={`fixed z-50 outline-none focus:outline-none bg-white h-screen right-0 top-0 overflow-y-auto w-[25vw] ease-linear duration-300 ${
          open ? "translate-x-0 " : "translate-x-full"
        }`}
      >
        <div
          className={`flex p-4 ${
            auth.data?.accessToken ? "justify-end" : "justify-between"
          }`}
        >
          {!auth.data?.accessToken && (
            <Link
              href={`/login`}
              className="text-red-500 font-semibold italic underline"
            >
              You need to login to pay
            </Link>
          )}
          <p
            onClick={() => setOpen(false)}
            className=" pb-3 cursor-pointer mr-4 pl-4"
          >
            close
          </p>
        </div>
        <div className="h-[74%] overflow-y-auto p-4 pt-0 z-20">
          {cart.map((item) => {
            return (
              <div
                className="grid grid-cols-5 border-t-gray-400 border-solid border-t mb-2 "
                key={item.rooms.room_ID}
              >
                <img
                  src={item.rooms.images[0]}
                  alt=""
                  className="w-10 h-10 rounded-full bg-contain col-span-1 my-auto"
                />
                <div className="col-span-2">
                  <p>{item.rooms.roomName}</p>
                  <p>${item.rooms.price}</p>
                </div>
                <div className="col-span-2 flex items-center justify-end">
                  <span>{item.quantity} night</span>
                  <button
                    className="ml-4 cursor-pointer p-2 mr-4"
                    onClick={() => {
                      item.quantity = 0
                      const newCart = cart.filter(
                        (a) => a.rooms.room_ID !== item.rooms.room_ID
                      )
                      session.setItem("carts", JSON.stringify(newCart), "local")
                      setCart(newCart)
                    }}
                  >
                    X
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        <div className="absolute bottom-4 w-full px-2 z-40 shadow-cart">
          <div className="flex justify-between py-4 px-1">
            <span className="">Subtotal: </span>
            <p className="">
              $
              {cart.reduce((acc, item) => {
                return acc + Number(item.rooms.price) * Number(item.quantity)
              }, 0)}
            </p>
          </div>
          <button
            className={`text-white bg-black focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center ${
              auth.data?.accessToken ? "hover:bg-blue-800" : "opacity-50"
            }`}
            type="button"
            onClick={checkout}
          >
            Checkout
          </button>
        </div>
      </div>
      {open && (
        <div
          className="opacity-25 fixed inset-0 z-40 bg-black"
          onClick={() => setOpen(false)}
        ></div>
      )}
    </>
  )
}

export default Cart
