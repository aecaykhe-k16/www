import { GetStaticPaths, GetStaticProps } from "next"
import Head from "next/head"
import { useRouter } from "next/router"
import { ParsedUrlQuery } from "querystring"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import Cart from "../../components/users/Cart"
import Header from "../../components/users/Header"
import MyBill from "../../components/users/MyBill"
import { refreshToken } from "../../redux/actions/authAction"
import { GET_ROOM } from "../../redux/types/roomType"
import { getAPI } from "../../utils/fecthData"
import { IRoom, IUser, RootStore, TypedDispatch } from "../../utils/types"
const routes = [
  {
    path: "cart",
    component: <Cart />
  },

  {
    path: "my-bill",
    component: <MyBill />
  }
]
const Account = ({ rooms }: { rooms: IRoom[] }) => {
  const { slug } = useRouter().query
  const [isActived, setIsActived] = useState<number>(0)
  let name = ""
  if (slug === "my-account") {
    name = "My Profile"
    // setIsActived(0)
  } else if (slug === "cart") {
    name = "My Cart"
    // setIsActived(1)
  } else if (slug === "my-bill") {
    name = "My Bill"
    // setIsActived(3)
  }
  const dispatch = useDispatch<TypedDispatch>()
  useEffect(() => {
    dispatch(refreshToken())
  }, [dispatch])

  const { auth } = useSelector((state: RootStore) => state)
  const [user, setUser] = useState<IUser>()
  useEffect(() => {
    if (auth.data?.user) {
      setUser(auth.data.user)
    }
  }, [auth.data?.user])

  dispatch({
    type: GET_ROOM,
    payload: rooms
  })
  return (
    <>
      {routes.map((route, index) => {
        if (route.path === `${slug}`) {
          return (
            <>
              <Head>
                <title>{name}</title>
              </Head>
              <div
                key={index}
                className="bg-gradient-to-br from-[#ffffff] to-[#c6f5ff]  bg-[#ffffff] min-h-screen"
              >
                <Header user={user} />
                <div className="grid grid-cols-12 h-auto mt-40">
                  <div className="col-span-1"></div>
                  <div className="col-span-10">{route.component}</div>
                  <div className="col-span-1"></div>
                </div>
              </div>
            </>
          )
        } else if (slug === "") {
          return (
            <>
              <Head>
                <title>My Profile</title>
              </Head>
              <div
                key={index}
                className="bg-gradient-to-br from-[#ffffff] to-[#c6f5ff]  bg-[#ffffff] h-screen"
              >
                <Header user={user} />
                <div className="grid grid-cols-12 h-auto mt-40">
                  <div className="col-span-1"></div>
                  <div className="col-span-10">{routes[0].component}</div>
                  <div className="col-span-1"></div>
                </div>
              </div>
            </>
          )
        }
      })}
    </>
  )
}

interface IParams extends ParsedUrlQuery {
  slug: string
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = routes.map((route) => {
    return {
      params: { slug: route.path }
    }
  })
  return { paths, fallback: false }
}

export const getStaticProps: GetStaticProps = async (context) => {
  const rooms = await (await getAPI("rooms")).data.data
  return {
    props: {
      rooms
    }
  }
}

export default Account
