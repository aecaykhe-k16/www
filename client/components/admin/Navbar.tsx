import Link from "next/link"
import { FaHotel } from "react-icons/fa"

const Navbar = () => {
  return (
    <div className="flex justify-between items-center bg-black px-4 py-3 fixed w-60 z-10 shadow-md shadow-gray-400">
      <Link href={"/"}>
        <div className="font-bold text-3xl text-[#FF0000] flex items-center">
          <FaHotel className="font-bold mr-4" />
          Hotel
        </div>
      </Link>
    </div>
  )
}

export default Navbar
