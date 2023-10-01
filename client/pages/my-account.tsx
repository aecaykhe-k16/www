import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { AiOutlineMail, AiOutlinePhone } from "react-icons/ai"
import { BiUser } from "react-icons/bi"
import { FaCheck, FaRegEdit } from "react-icons/fa"
import { MdPassword } from "react-icons/md"
import Header from "../components/users/Header"
import { useDispatch, useSelector } from "react-redux"
import { IUser, InputChange, RootStore, TypedDispatch } from "../utils/types"
import { refreshToken, updateProfile } from "../redux/actions/authAction"
import Head from "next/head"

const MyAccount = () => {
  const pathName = useRouter().pathname.split("/")[1]
  const router = useRouter()
  const [isEdit, setIsEdit] = useState(false)

  const dispatch = useDispatch<TypedDispatch>()
  useEffect(() => {
    dispatch(refreshToken())
  }, [dispatch])

  const { auth } = useSelector((state: RootStore) => state)
  const [user, setUser] = useState<IUser>()
  const [oldUser, setOldUser] = useState<IUser>()
  useEffect(() => {
    if (auth.data?.user) {
      setUser(auth.data.user)
      setOldUser(auth.data.user)
    }
  }, [auth.data?.user])
  const handleChangeInput = (e: InputChange) => {
    const { value, name } = e.target
    let newUser: IUser
    if (user) {
      newUser = { ...user, [name]: value }
      setUser(newUser)
    }
  }

  const changeInfo = () => {
    setIsEdit(!isEdit)
    const firstName = document.getElementsByName("firstName")[0]
    const lastName = document.getElementsByName("lastName")[0]
    const phone = document.getElementsByName("phone")[0]
    const email = document.getElementsByName("email")[0]
    if (isEdit) {
      firstName.setAttribute("readonly", "true")
      lastName.setAttribute("readonly", "true")
      phone.setAttribute("readonly", "true")
      email.setAttribute("readonly", "true")
      if (oldUser && user)
        if (
          oldUser.firstName !== user.firstName ||
          oldUser.lastName !== user.lastName ||
          oldUser.phone !== user.phone ||
          oldUser.email !== user.email ||
          oldUser.avatar !== user.avatar ||
          oldUser.password !== user.password
        ) {
          dispatch(updateProfile(user))
        } else {
          alert("Bạn chưa thay đổi thông tin gì")
        }
    } else {
      firstName.removeAttribute("readonly")
      lastName.removeAttribute("readonly")
      phone.removeAttribute("readonly")
      email.removeAttribute("readonly")
    }
  }

  return (
    <>
      <Head>
        <title>My Account</title>
      </Head>
      <main>
        <div className="bg-gradient-to-br from-[#ffffff] to-[#c6f5ff]  bg-[#ffffff] min-h-screen">
          <Header isEdit={isEdit} user={user} setUser={setUser} />
          <div className="grid grid-cols-12 max-h-screen mt-40">
            <div className="col-span-1"></div>
            <div className="col-span-10 relative">
              <h1 className="text-3xl ml-16">
                My Profile {isEdit && "(Bạn đang sửa thông tin)"}
              </h1>
              <div className="grid grid-cols-12">
                <div className="relative col-span-4 h-auto m-8 border-black border rounded-xl bg-white shadow-lg">
                  <i className="absolute right-6 top-5 text-2xl text-yellow-300">
                    <BiUser />
                  </i>
                  <h2 className="relative text-xl ml-8 mt-4 font-bold">
                    First name
                  </h2>
                  <input
                    className="w-64 ml-8 mb-8 mt-1 focus:outline-none"
                    type="text"
                    value={user?.firstName}
                    onChange={handleChangeInput}
                    readOnly
                    name="firstName"
                    id="firstName"
                  />
                </div>
                <div className="relative col-span-4 h-auto m-8 border-black border rounded-xl bg-white shadow-lg">
                  <i className="absolute right-6 top-5 text-2xl text-yellow-300">
                    <BiUser />
                  </i>
                  <h2 className="text-xl ml-8 mt-4 font-bold">Last name</h2>
                  <input
                    className="w-64 ml-8 mb-8 mt-1 focus:outline-none"
                    type="text"
                    value={user?.lastName}
                    onChange={handleChangeInput}
                    readOnly
                    name="lastName"
                    id="lastName"
                  />
                </div>
                <div className="relative col-span-4 h-auto m-8 border-black border rounded-xl bg-white shadow-lg">
                  <i className="absolute right-6 top-5 text-2xl text-yellow-300">
                    <AiOutlinePhone />
                  </i>
                  <h2 className="text-xl ml-8 mt-4 font-bold">Phone</h2>
                  <input
                    className="w-64 ml-8 mb-8 mt-1 focus:outline-none"
                    type="text"
                    value={user?.phone}
                    onChange={handleChangeInput}
                    readOnly
                    name="phone"
                    id="phone"
                  />
                </div>
                <div className="relative col-span-4 h-auto m-8 border-black border rounded-xl bg-white shadow-lg">
                  <i className="absolute right-6 top-5 text-2xl text-yellow-300">
                    <AiOutlineMail />
                  </i>
                  <h2 className="text-xl ml-8 mt-4 font-bold">Email</h2>
                  <input
                    className="w-64 ml-8 mb-8 mt-1 focus:outline-none"
                    type="text"
                    value={user?.email}
                    onChange={handleChangeInput}
                    readOnly
                    name="email"
                    id="email"
                  />
                </div>
                <div className="relative col-span-4 h-auto m-8 border-black border rounded-xl bg-white shadow-lg">
                  <i className="absolute right-6 top-5 text-2xl text-yellow-300">
                    <MdPassword />
                  </i>
                  <h2 className="text-xl ml-8 mt-4 font-bold">Password</h2>
                  <input
                    className="ml-8 mb-8 border-0 mt-1 focus:outline-none "
                    type={isEdit ? "text" : "password"}
                    value={user?.password}
                    placeholder="********"
                    onChange={handleChangeInput}
                    readOnly={!isEdit}
                    name="password"
                    id="password"
                  />
                </div>
              </div>
              <div className="absolute right-9 bottom-9" id="button">
                <button
                  className="bg-yellow-300 px-4 py-2 rounded-full text-black text-3xl w-14 h-14 text-center"
                  onClick={changeInfo}
                  id="changeInfo"
                >
                  {isEdit ? <FaCheck /> : <FaRegEdit />}
                </button>
              </div>
            </div>
            <div className="col-span-1"></div>
          </div>
        </div>
      </main>
    </>
  )
}

export default MyAccount
