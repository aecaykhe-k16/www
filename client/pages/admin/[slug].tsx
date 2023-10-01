import { GetStaticPaths, GetStaticProps } from "next"
import Head from "next/head"
import { useRouter } from "next/router"
import { ParsedUrlQuery } from "querystring"
import { useDispatch } from "react-redux"
import Navbar from "../../components//admin/Navbar"
import Slidebar from "../../components//admin/Slidebar"
import CreateRoom from "../../components/admin/CreateRoom"
import ListBooking from "../../components/admin/ListBooking"
import ListRoom from "../../components/admin/ListRoom"
import ListUser from "../../components/admin/ListUser"
import UserComment from "../../components/admin/UserComment"
import { GET_COMMENT } from "../../redux/types/commentType"
import { GET_USER } from "../../redux/types/userType"
import { getAPI } from "../../utils/fecthData"
import { IComment, IRoom, IUser, TypedDispatch } from "../../utils/types"
import { GET_ROOM } from "../../redux/types/roomType"
const routes = [
  {
    path: "users",
    component: <ListUser />
  },
  {
    path: "create-room",
    component: <CreateRoom />
  },
  {
    path: "list-room",
    component: <ListRoom />
  },
  {
    path: "bookings",
    component: <ListBooking />
  },
  {
    path: "user-comment",
    component: <UserComment />
  }
]

interface IProps {
  users: IUser[]
  comments: IComment[]
  rooms: IRoom[]
}

const Detail = ({ users, comments, rooms }: IProps) => {
  const { slug } = useRouter().query
  const dispatch = useDispatch<TypedDispatch>()

  dispatch({
    type: GET_USER,
    payload: users
  })
  dispatch({
    type: GET_COMMENT,
    payload: comments
  })
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
                <title>{route.path}</title>
              </Head>
              <div key={index}>
                <Navbar />
                <div className="flex">
                  <Slidebar />
                  <div className="ml-64 h-screen flex-1">
                    <div className="p-4 ">{route.component}</div>
                  </div>
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
  const users: IUser[] = await (await getAPI("users")).data.data
  const comments = await (await getAPI("comments")).data.data
  const rooms = await (await getAPI("rooms")).data.data
  return {
    props: {
      users,
      comments,
      rooms
    }
  }
}

export default Detail
