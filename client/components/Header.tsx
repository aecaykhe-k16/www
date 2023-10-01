import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { AiOutlineSearch } from "react-icons/ai"
import { BsCart3 } from "react-icons/bs"
import { FaTimes } from "react-icons/fa"
import { useDispatch, useSelector } from "react-redux"
import { logout, refreshToken } from "../redux/actions/authAction"
import { useStorage } from "../utils/hooks"

import { getRooms } from "../redux/actions/roomAction"
import { getUsers } from "../redux/actions/userAction"
import {
  FormSubmit,
  ICart,
  IRoom,
  InputChange,
  RootStore,
  TypedDispatch,
  IUser
} from "../utils/types"
import Cart from "./Cart"
const Header = () => {
  const router = useRouter()
  const dispatch = useDispatch<TypedDispatch>()
  useEffect(() => {
    dispatch(getRooms())
    dispatch(getUsers())
    dispatch(refreshToken())
  }, [dispatch])
  const { auth, rooms } = useSelector((state: RootStore) => state)
  const [openSlidebar, setOpenSlidebar] = useState(false)
  const [user, setUser] = useState<IUser>()
  useEffect(() => {
    if (openSlidebar) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }
  }, [openSlidebar])
  let pathName = ""
  useEffect(() => {
    pathName = router.pathname
    session.setItem("saveSlugLogin", JSON.stringify(pathName), "local")
  }, [router])
  const [search, setSearch] = useState("")

  const session = useStorage()
  const [cart, setCart] = useState<ICart[]>([])
  const [result, setResult] = useState<IRoom[]>([])
  const [toggleResult, setToggleResult] = useState(false)

  useEffect(() => {
    if (session.getItem("carts", "local") !== undefined) {
      setCart(JSON.parse(session.getItem("carts", "local")))
    }
  }, [session.getItem("carts", "local")])

  useEffect(() => {
    if (!search) return setResult([])
    rooms.map((item) => {
      item.roomName.toLowerCase().includes(search.toLowerCase()) &&
        setResult((prev) => [...prev, item])
    })

    return () => setResult([])
  }, [search])
  const handleSubmit = (e: FormSubmit) => {
    e.preventDefault()
    router.push(`/booking?search=${search}`)

    setToggleResult(false)
  }

  useEffect(() => {
    if (auth.data) {
      setUser(auth.data.user)
    }
  }, [auth.data])
  return (
    <nav className=" h-20 w-full flex justify-between bg-white items-center border-gray-200 px-10 py-2.5 shadow-md z-50 fixed ">
      <Link href="/" className="flex items-center">
        <img
          src="https://res.cloudinary.com/dkh1ozkvt/image/upload/v1682492921/1_grzzwk.png"
          className="h-6 mr-3 sm:h-9 bg-black rounded-full"
          alt="Flowbite Logo"
        />
        <span className="self-center text-xl font-semibold whitespace-nowrap text-black">
          StarlightHotel
        </span>
      </Link>
      <div>
        <form onSubmit={handleSubmit}>
          <div className="relative flex items-center p-2 text-sm text-gray-900 border border-gray-300 rounded-3xl bg-gray-50 w-max">
            <div className="bg-orange-400 p-2 w-8 rounded-full mr-4">
              <AiOutlineSearch className="text-lg font-extrabold cursor-pointer" />
            </div>
            <input
              type="text"
              id="search-navbar"
              className="block w-full outline-none bg-gray-50"
              placeholder="Search..."
              value={search}
              onChange={(e: InputChange) => {
                setSearch(e.target.value)
                setToggleResult(true)
              }}
              onFocus={() => setToggleResult(true)}
            />
            {search && (
              <FaTimes
                className="text-lg font-extrabold cursor-pointer text-red-600"
                onClick={() => setSearch("")}
              />
            )}
          </div>
        </form>
        {toggleResult && (
          <div className="h-fit bg-white fixed z-50 w-[40rem] mt-2 rounded-lg shadow-md shadow-gray-600 overflow-hidden overflow-y-auto">
            <ul className="space-y-2">
              {result.map((item) => (
                <Link
                  href={`room/${item.room_ID}`}
                  className="flex items-center justify-between px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  key={item.room_ID}
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.images[0]}
                      alt={item.roomName}
                      className="w-10 h-10 rounded-full bg-contain sm:h-9"
                    />
                    <span className="text-lg font-semibold">
                      {item.roomName}
                    </span>
                  </div>
                  <span>
                    <AiOutlineSearch className="text-xl" />
                  </span>
                </Link>
              ))}
            </ul>
          </div>
        )}
      </div>

      {auth.data?.accessToken ? (
        <div className="space-x-4 flex items-center justify-center ">
          <div className="relative group cursor-pointer">
            {user?.avatar == null ? (
              <div className="w-10 h-10 rounded-full bg-contain sm:h-9 bg-[#243d51] flex justify-center items-center font-bold text-3xl text-white">
                {user?.firstName.charAt(0).toLocaleUpperCase()}
              </div>
            ) : (
              <img
                id="avatar"
                className="w-10 h-10 rounded-full bg-contain sm:h-9 "
                src={auth.data.user.avatar}
                alt=""
              />
            )}

            <ul className="mb-8 space-y-4 group-hover:text-black hidden show group-hover:w-48 group-hover:h-fit group-hover:bg-white group-hover:-left-32 group-hover:before:left-36 group-hover:shadow-[0_0_30px_-15px_rgb(0,0,0)] group-hover:before:border-b-white group-hover:after:h-8 group-hover:after:w-28 group-hover:after:absolute group-hover:after:-top-5 group-hover:after:left-16">
              <Link href="/my-account">
                <li className="text-lg text-gray-500 hover:text-black">
                  <span>My account</span>
                </li>
              </Link>
              <li
                className="text-lg text-gray-500 hover:text-black"
                onClick={() => {
                  if (!auth.data?.accessToken) return
                  dispatch(logout())
                }}
              >
                Logout
              </li>
            </ul>
          </div>
          <Link
            href="/booking"
            className="flex items-center border-black border-2 rounded-3xl  cursor-pointer"
          >
            <button className="bg-white px-6 py-2 rounded-3xl font-bold">
              BOOK NOW
            </button>
          </Link>
          <div className="relative">
            <BsCart3
              className="text-3xl cursor-pointer"
              onClick={() => {
                setOpenSlidebar(true)
              }}
            />
            {cart.length !== 0 && (
              <span className="absolute -top-3 -right-2 bg-cyan-600 rounded-full w-3 h-3 flex items-center justify-center p-3 text-lg font-bold text-white">
                {cart.length}
              </span>
            )}
          </div>
        </div>
      ) : (
        <div className="flex items-center space-x-4 relative">
          <Link href={`/login`} className="text-5xl cursor-pointer">
            <button
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center flex mx-auto"
              type="button"
            >
              Login
            </button>
          </Link>
          <>
            <Link
              href="/booking"
              className="flex items-center border-black border-2 rounded-3xl  cursor-pointer"
            >
              <button className="bg-white px-6 py-2 rounded-3xl font-bold">
                BOOK NOW
              </button>
            </Link>
            <BsCart3
              className="text-3xl cursor-pointer"
              onClick={() => {
                setOpenSlidebar(true)
              }}
            />
            {cart.length !== 0 && (
              <span className="absolute -top-3 -right-2 bg-cyan-600 rounded-full w-3 h-3 flex items-center justify-center p-3 text-lg font-bold text-white">
                {cart.length}
              </span>
            )}
          </>
        </div>
      )}
      <Cart open={openSlidebar} setOpen={setOpenSlidebar} />
    </nav>
  )
}

export default Header
