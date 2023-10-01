import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { AiTwotoneHome } from "react-icons/ai"
import { CgLogOff } from "react-icons/cg"
import { FaChevronDown, FaHotel, FaUserTie } from "react-icons/fa"
import { TbBrandBooking } from "react-icons/tb"
import { getAPI } from "../../utils/fecthData"
import { IUser } from "../../utils/types"

const Slidebar = () => {
  const { slug } = useRouter().query
  const { pathname } = useRouter()
  const [dashboard, setDashboard] = useState(false)
  const [user, setUser] = useState(false)
  const [hotel, setHotel] = useState(false)
  const [booking, setBooking] = useState(false)
  const [profile, setProfile] = useState(false)
  const [comment, setUserComment] = useState(false)
  //open the submenu
  useEffect(() => {
    if (slug === "/" || "") {
      setDashboard(true)
    } else if (slug === "users") {
      setUser(true)
    } else if (slug === "create-room" || slug === "list-room") {
      setHotel(true)
    } else if (slug === "bookings") {
      setBooking(true)
    } else if (slug === "user-comment") {
      setUserComment(true)
    }
  }, [slug])

  return (
    <aside className="w-60 bg-black text-white h-[92vh] overflow-auto no-scrollbar pb-10 fixed top-[8%] z-20 xl:h-screen xl:top-14">
      <div className="pt-1">
        <ul>
          <li className={pathname === "/admin" ? "bg-[#FF0000]" : ""}>
            <Link
              href="/admin"
              className="pl-7 flex items-center p-2 text-xl font-normal group  hover:bg-[#FF0000] cursor-pointer]"
            >
              <AiTwotoneHome
                className={`${
                  slug === "/admin" && "text-white "
                } "text-[#ff0000] group-hover:text-white"`}
              />
              <span className="ml-3">Dashboard</span>
            </Link>
          </li>
          <li className={slug === "users" ? "bg-[#FF0000]" : ""}>
            <button
              type="button"
              className="p-2 pl-0 w-full text-xl font-normal transition duration-7 hover:bg-[#FF0000] group"
            >
              <Link
                href="/admin/users"
                className="p-2 font-normal pl-7 flex items-center text-lg"
              >
                <FaUserTie
                  className={`${
                    slug === "users" && "text-white "
                  } "text-[#ff0000] group-hover:text-white"`}
                />
                <span
                  className="flex-1 ml-3 text-left whitespace-nowrap"
                  sidebar-toggle-item="true"
                >
                  User
                </span>
              </Link>
            </button>
          </li>
          <li
            onClick={() => {
              setHotel(!hotel)
            }}
          >
            <button
              type="button"
              className="pl-7 flex items-center p-2 w-full text-xl font-normal transition duration-7 group hover:bg-[#FF0000]"
              aria-controls="dropdown-example"
              data-collapse-toggle="dropdown-example"
            >
              <FaHotel
                className={`${
                  slug === "create-room" ||
                  (slug === "list-room" && "text-white ")
                } "text-[#ff0000] group-hover:text-white"`}
              />
              <span
                className="flex-1 ml-3 text-left whitespace-nowrap"
                sidebar-toggle-item="true"
              >
                Room
              </span>
              <FaChevronDown />
            </button>
            {hotel && (
              <ul
                className="flex flex-col w-full h-0"
                style={{
                  height: "fit-content",
                  transition: "all 2s linear"
                }}
              >
                <li className={slug === "create-room" ? "bg-[#FF0000]" : ""}>
                  <Link
                    href="/admin/create-room"
                    className="p-2 font-normal pl-7 flex items-center text-lg  hover:bg-[#FF0000] cursor-pointer"
                  >
                    <span>Create</span>
                  </Link>
                </li>
                <li className={slug === "list-room" ? "bg-[#FF0000]" : ""}>
                  <Link
                    href="/admin/list-room"
                    className="p-2 font-normal pl-7 flex items-center text-lg  hover:bg-[#FF0000] cursor-pointer"
                  >
                    <span>List</span>
                  </Link>
                </li>
                <li className={slug === "user-comment" ? "bg-[#FF0000]" : ""}>
                  <Link
                    href="/admin/user-comment"
                    className="p-2 font-normal pl-7 flex items-center text-lg  hover:bg-[#FF0000] cursor-pointer"
                  >
                    <span>User comment</span>
                  </Link>
                </li>
              </ul>
            )}
          </li>
          <li
            onClick={() => {
              setBooking(!booking)
            }}
          >
            <button
              type="button"
              className="pl-7 flex items-center p-2 w-full text-xl font-normal transition duration-7 hover:bg-[#FF0000] group"
              aria-controls="dropdown-example"
              data-collapse-toggle="dropdown-example"
            >
              <TbBrandBooking
                className={`${
                  slug === "bookings" && "text-white "
                } "text-[#ff0000] group-hover:text-white"`}
              />
              <span
                className="flex-1 ml-3 text-left whitespace-nowrap"
                sidebar-toggle-item="true"
              >
                Bookings
              </span>
              <FaChevronDown />
            </button>
            {booking && (
              <ul
                className="flex flex-col w-full h-0"
                style={{
                  height: "fit-content",
                  transition: "all 2s linear"
                }}
              >
                <li className={slug === "bookings" ? "bg-[#FF0000]" : ""}>
                  <Link
                    href="/admin/bookings"
                    className="p-2 font-normal pl-7 flex items-center text-lg  hover:bg-[#FF0000] cursor-pointer"
                  >
                    <span>All</span>
                  </Link>
                </li>
              </ul>
            )}
          </li>
        </ul>
      </div>
      <button
        className="bg-black z-30 absolute bottom-14 left-0 w-64 py-2 group text-[#ff0000]"
        title="logout"
        type="button"
      >
        <CgLogOff className="mx-auto group-hover:text-white text-xl  group-hover:animate-spin animate-un-spin" />
      </button>
    </aside>
  )
}
export const getStaticProps = async () => {
  const res = await getAPI("users")
  const users: IUser[] = res.data.data
  return {
    props: {
      users
    }
  }
}

export default Slidebar
