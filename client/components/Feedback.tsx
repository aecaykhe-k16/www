import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { FaStar } from "react-icons/fa"
import { useDispatch, useSelector } from "react-redux"
import ONE_STAR from "../assets/icon/1star.gif"
import TWO_STAR from "../assets/icon/2star.gif"
import THREE_STAR from "../assets/icon/3star.gif"
import FOUR_STAR from "../assets/icon/4star.gif"
import FIVE_STAR from "../assets/icon/5star.gif"
import { refreshToken } from "../redux/actions/authAction"
import { createComment } from "../redux/actions/commentAction"
import { imageUpload } from "../utils/ImageUpload"
import { useStorage } from "../utils/hooks"
import {
  FormSubmit,
  IComment,
  IRoom,
  InputChange,
  RootStore,
  TypedDispatch
} from "../utils/types"

const listIcon = [
  {
    id: 1,
    icon: <Image src={ONE_STAR} alt="" className="w-10 h-10" />
  },
  {
    id: 2,
    icon: <Image src={TWO_STAR} alt="" className="w-10 h-10" />
  },
  {
    id: 3,
    icon: <Image src={THREE_STAR} alt="" className="w-10 h-10" />
  },
  {
    id: 4,

    icon: <Image src={FOUR_STAR} alt="" className="w-10 h-10" />
  },
  {
    id: 5,

    icon: <Image src={FIVE_STAR} alt="" className="w-10 h-10" />
  }
]

const FeedBack = ({ room }: { room: IRoom }) => {
  const dispatch = useDispatch<TypedDispatch>()
  const { auth } = useSelector((state: RootStore) => state)
  const initialState: IComment = {
    email: "",
    room_ID: room.room_ID,
    comment: "",
    point: 0,
    image: ""
  }
  let pathName = ""
  const router = useRouter()
  const session = useStorage()
  useEffect(() => {
    dispatch(refreshToken())
  }, [dispatch])
  useEffect(() => {
    pathName = router.asPath
    session.setItem("saveSlugLogin", JSON.stringify(pathName), "local")
  }, [router])
  useEffect(() => {
    if (auth.data?.accessToken) {
      setComment({ ...comment, email: auth.data.user.email })
    }
  }, [dispatch])

  const [rating, setRating] = useState(0)

  const [comment, setComment] = useState<IComment>(initialState)

  const handleStarHover = (index: number) => {
    setRating(index)
    setComment({ ...comment, point: index })
  }

  const [img, setImg] = useState<File>()

  const handleChangeInput = (e: InputChange) => {
    const { name, value } = e.target
    setComment({ ...comment, [name]: value })
  }

  function handleSubmit(event: FormSubmit): void {
    event.preventDefault()
    if (!auth.data?.accessToken) return
    if (!comment.email) return
    dispatch(createComment(comment, auth.data?.accessToken))
  }

  return (
    <div>
      <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
        Your Ratings
      </h5>
      <br />
      <div className="flex space-x-4 items-center h-4">
        {[1, 2, 3, 4, 5].map((index) => (
          <span
            key={index}
            onMouseEnter={() => handleStarHover(index)}
            className={`${
              rating >= index ? "text-yellow-500" : "text-gray-400"
            } cursor-pointer
          `}
          >
            <FaStar />
          </span>
        ))}
        {listIcon.find((item) => item.id === rating)?.icon}
      </div>
      <br />
      <br />
      <div className="relative">
        <form onSubmit={handleSubmit}>
          <div className="w-full mb-4 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
            <div className="flex items-center justify-between px-3 py-2 border-b dark:border-gray-600">
              <div className="flex flex-wrap items-center divide-gray-200 sm:divide-x dark:divide-gray-600">
                <div className="flex items-center space-x-1 sm:pr-4">
                  <label>
                    <svg
                      aria-hidden="true"
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>

                    <input
                      className="hidden"
                      id="file"
                      type="file"
                      name="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          setImg(e.target.files[0])
                          imageUpload(Array.from(e.target.files))
                            .then((res) => {
                              // setFiles([...files, ...res])
                              setComment({
                                ...comment,
                                image: res[0]
                              })
                            })
                            .catch((err) => {
                              console.log(err)
                            })
                        }
                      }}
                    />
                  </label>
                  <button
                    type="button"
                    className="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
                  >
                    <svg
                      aria-hidden="true"
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                    <span className="sr-only">Attach file</span>
                  </button>
                </div>
                <div className="flex flex-wrap items-center space-x-1 sm:pl-4">
                  <button
                    type="button"
                    className="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
                  ></button>
                </div>
              </div>
              <button
                type="button"
                data-tooltip-target="tooltip-fullscreen"
                className="p-2 text-gray-500 rounded cursor-pointer sm:ml-auto hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
              ></button>
              <div
                id="tooltip-fullscreen"
                role="tooltip"
                className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
              >
                <div className="tooltip-arrow" data-popper-arrow></div>
              </div>
              {!auth.data?.accessToken && (
                <Link
                  href={`/login`}
                  className="text-red-500 font-semibold italic underline"
                >
                  You need to login to comment
                </Link>
              )}
            </div>

            <div className="px-4 py-2 bg-white rounded-b-lg dark:bg-gray-800">
              <textarea
                id="editor"
                rows={5}
                className="block w-full px-0 text-sm text-gray-800 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400"
                placeholder="Write more comment...."
                required
                value={comment.comment}
                onChange={handleChangeInput}
                name="comment"
              ></textarea>
              <br />

              {img && (
                <img src={URL.createObjectURL(img)} className="w-24 h-24" />
              )}

              <br />
            </div>
          </div>
          <button
            className={`absolute bottom-1 right-1 bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-md  ${
              !auth.data?.accessToken && "cursor-not-allowed"
            } `}
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  )
}

export default FeedBack
