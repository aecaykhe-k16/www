import Link from "next/link"
import React, { useEffect, useState } from "react"
import { AiFillCamera } from "react-icons/ai"
import { imageUpload } from "../../utils/ImageUpload"
import { IUser } from "../../utils/types"
import { BiCartAlt, BiUser } from "react-icons/bi"
import { MdFavoriteBorder } from "react-icons/md"
import { RiBillLine } from "react-icons/ri"
import { useRouter } from "next/router"

interface Props {
  isEdit?: boolean
  user?: IUser
  setUser?: (user?: IUser) => void
}

const Header = ({ isEdit, user, setUser }: Props) => {
  const { slug } = useRouter().query
  const { pathname } = useRouter()

  const [cart, setCart] = useState(false)
  const [bill, setBill] = useState(false)

  useEffect(() => {
    if (slug === "cart") {
      setCart(true)
    } else if (slug === "my-bill") {
      setBill(true)
    }
  }, [slug])

  const [ava, setAvatar] = useState<string>()
  useEffect(() => {
    if (user?.avatar) setAvatar(user.avatar)
  }, [user?.avatar])

  const [currnetFileImg, setCurrnetFileImg] = useState<File | undefined>(
    undefined
  )
  const handleChangeImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files: File[] = Array.from(e.target.files!)
    setCurrnetFileImg(files[0])
    imageUpload(files)
      .then((res) => {
        setAvatar(res[0])
      })
      .catch((err) => {
        // console.log(err)
      })
  }
  useEffect(() => {
    const avaChange = document.getElementById("avatar")
    if (ava && avaChange) {
      avaChange.setAttribute("src", ava)
      if (user && setUser) setUser({ ...user, avatar: ava })
    }
  }, [ava])

  return (
    <div className="header h-32">
      <div className="relative w-full h-auto">
        <div className="backdrop-blur-sm bg-[#01010129] h-12 w-64 absolute rounded-md overflow-hidden">
          <Link href="/" className="flex items-center absolute">
            <img
              src="https://res.cloudinary.com/dkh1ozkvt/image/upload/v1682492921/1_grzzwk.png"
              className="h-6 mr-3 sm:h-12"
              alt="Flowbite Logo"
            />
            <span className="self-center text-3xl font-semibold whitespace-nowrap text-white">
              StarlightHotel
            </span>
          </Link>
        </div>
        <img
          className="w-full h-48 object-cover"
          src="https://res.cloudinary.com/dkh1ozkvt/image/upload/v1683962810/887559_xzso9x.jpg"
          alt=""
        />
        {ava ? (
          <img
            id="avatar"
            className="absolute rounded-full w-48 h-48 top-1/3 left-1/4 transform -translate-x-1/2 object-cover "
            src={currnetFileImg ? URL.createObjectURL(currnetFileImg) : ava}
            alt=""
          />
        ) : (
          <div className="absolute rounded-full w-48 h-48 top-1/3 left-1/4 transform -translate-x-1/2 object-cover bg-[#243d51] flex justify-center items-center font-bold text-[11rem] text-white">
            {user?.firstName?.charAt(0)}
          </div>
        )}

        {isEdit && (
          <label
            htmlFor="file"
            className="flex items-center justify-center cursor-pointer space-x-1 p-2 text-white bg-gray-800 absolute rounded-full -bottom-1/3 left-[30%] transform -translate-x-1/2 object-cover w-10 h-10"
          >
            <AiFillCamera className="w-6 h-6" />
            <input
              type="file"
              id="file"
              accept=".png, .jpeg, .jpg"
              className="hidden"
              value={""}
              onChange={handleChangeImg}
            />
          </label>
        )}
        <div className="absolute -bottom-1 left-1/3">
          <ul className="items-end mt-16 flex">
            <li
              className={`text-white backdrop-blur-sm bg-[#010101b2] rounded-xl list-item m-2 text-xl font-semibold hover:-translate-y-1 border-gray-500 ${
                !cart && !bill && "-translate-y-1"
              }`}
            >
              <Link href="/my-account/" className="p-2 flex">
                <BiUser className="mt-1" />
                My Profile
              </Link>
            </li>

            <li
              className={`text-white backdrop-blur-sm bg-[#010101b2] rounded-xl list-item m-2 text-xl font-semibold hover:-translate-y-1 border-gray-500 ${
                cart && "-translate-y-1"
              }`}
            >
              <Link href="/my-account/cart" className="p-2 flex">
                <BiCartAlt className="mt-1" />
                My Cart
              </Link>
            </li>
            <li
              className={`text-white backdrop-blur-sm bg-[#010101b2] rounded-xl list-item m-2 text-xl font-semibold hover:-translate-y-1 border-gray-500
              ${bill && "-translate-y-1"}
              `}
            >
              <Link href="/my-account/my-bill" className="p-2 flex">
                <RiBillLine className="mt-1" />
                My Bill
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Header
