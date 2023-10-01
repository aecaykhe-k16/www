import Head from "next/head"
import { useRouter } from "next/router"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import Dashboard from "../components/admin/Dashboard"
import Navbar from "../components/admin/Navbar"
import Slidebar from "../components/admin/Slidebar"
import { refreshToken } from "../redux/actions/authAction"
import { RootStore, TypedDispatch } from "../utils/types"

const Admin = () => {
  const pathName = useRouter().pathname.split("/")[1]
  const dispatch = useDispatch<TypedDispatch>()
  useEffect(() => {
    dispatch(refreshToken())
  }, [dispatch])
  const { auth } = useSelector((state: RootStore) => state)

  if (auth.data?.user.role !== "ADMIN")
    return (
      <>
        <Head>
          <title>404:This page could not be found.</title>
        </Head>
        <div className="bg-black flex justify-center items-center text-white h-screen">
          <span className="h-10 border-r border-white text-center flex items-center p-4 mr-4 text-3xl">
            404
          </span>{" "}
          This page could not be found.
        </div>
      </>
    )
  return (
    <>
      <Head>
        <title>{pathName}</title>
      </Head>
      <div>
        <Navbar />
        <div className="flex">
          <Slidebar />
          <div className="ml-64 h-screen  flex-1">
            <div className="p-2 ">
              <Dashboard />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Admin
