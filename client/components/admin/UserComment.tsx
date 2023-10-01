import { motion } from "framer-motion"
import { useState } from "react"
import { AiFillStar, AiOutlineStar } from "react-icons/ai"
import { useSelector } from "react-redux"
import { IComment, InputChange, RootStore } from "../../utils/types"
import LoadingSpin from "../alter/LoadingSpin"

interface IFilter {
  name: string
  value: string
}

const UserComment = () => {
  const [comment, setComment] = useState<IComment>()
  const { comments, rooms, users } = useSelector((state: RootStore) => state)
  const [filterComment, setFilterComment] = useState<IComment[]>(comments)

  if (!comments) return <LoadingSpin title="Loading" />
  const renderStart = (rate?: number) => {
    if (!rate) return
    const stars = []
    const max = 5
    for (let i = 0; i < max; i++) {
      if (i < rate) {
        stars.push(<AiFillStar key={i} className="text-[#FFD700]" />)
      } else {
        stars.push(<AiOutlineStar key={i} className="text-[#FFD700]" />)
      }
    }
    return stars
  }
  const initialFilter = [
    {
      name: "month",
      value: "00"
    },
    {
      name: "vote",
      value: "00"
    }
  ]

  const [filter, setFilter] = useState<IFilter[]>(initialFilter)
  const handleFilter = (e: InputChange) => {
    const { name, value } = e.target

    if (value === "00") {
      setFilter(initialFilter)
    } else {
      if (name === "month") {
        filter[0].value = value
        const newFilter = comments.filter(
          (comment) => comment.createdAt?.toString().split("/")[1] === value
        )
        setFilterComment(newFilter)
        if (filter[1].value !== "00") {
          const newFilter = comments.filter(
            (comment) =>
              comment.createdAt?.toString().split("/")[1] === value &&
              comment.point === +filter[1].value
          )
          setFilterComment(newFilter)
        }
      } else if (name === "vote") {
        filter[1].value = value
        const newFilter = comments.filter((comment) => comment.point === +value)
        setFilterComment(newFilter)
        if (filter[0].value !== "00") {
          const newFilter = comments.filter(
            (comment) =>
              comment.point === +value &&
              comment.createdAt?.toString().split("/")[1] === filter[0].value
          )
          setFilterComment(newFilter)
        }
      }
    }
  }

  return (
    <div className="relative w-full">
      <div className="align-middle float-right text-base mr-12 mb-2">
        <span className="ml-10 font-medium">Month:</span>
        <select
          name="month"
          id=""
          className="border-2 rounded-md pl-2 pr-2 pt-1 pb-1 ml-2"
          onChange={handleFilter}
        >
          <option value="00">---</option>
          <option value="01">January</option>
          <option value="02">February</option>
          <option value="03">March</option>
          <option value="04">April</option>
          <option value="05">May</option>
          <option value="06">June</option>
          <option value="07">July</option>
          <option value="08">August</option>
          <option value="09">September</option>
          <option value="10">October</option>
          <option value="11">November</option>
          <option value="12">December</option>
        </select>
        <span className="ml-10 font-medium">Vote:</span>
        <select
          name="vote"
          id=""
          className="border-2 rounded-md pl-2 pr-2 pt-1 pb-1 ml-2"
          onChange={handleFilter}
        >
          <option value="00">---</option>
          <option value="1">1 star</option>
          <option value="2">2 star</option>
          <option value="3">3 star</option>
          <option value="4">4 star</option>
          <option value="5">5 star</option>
        </select>
      </div>
      <motion.div layout className="grid grid-cols-2 clear-both gap-2">
        {filterComment.length > 0 ? (
          filterComment.map((comment) => (
            <motion.div
              className="border rounded-xl shadow-lg"
              layout
              animate={{ opacity: 1 }}
              initial={{ opacity: 0 }}
              exit={{ opacity: 0 }}
            >
              <div className="ml-4 text-xl font-semibold leading-10 pt-2 align-middle">
                <span>
                  {
                    rooms.find((room) => room.room_ID === comment.room_ID)
                      ?.roomName
                  }{" "}
                </span>
                <span> || </span>
                <span>
                  {" "}
                  {
                    users.find((user) => user.email === comment.email)
                      ?.firstName
                  }{" "}
                  {users.find((user) => user.email === comment.email)?.lastName}
                </span>
              </div>
              <div className=" grid grid-cols-12 mt-2">
                <div className="col-span-7 mr-4 ml-4 ">
                  <p className="h-fit">{comment.comment}</p>
                  <div className="flex items-center leading-10 text-lg">
                    <span>Rating: </span>
                    <span className="flex ml-2 text-yellow-400">
                      {renderStart(comment.point)}
                    </span>
                  </div>
                  <span className="h-fit">
                    {comment?.createdAt?.toString()}
                  </span>
                </div>
                <div className="col-span-5 rounded-lg">
                  <img
                    src="https://res.cloudinary.com/dkh1ozkvt/image/upload/v1683833277/www/deluxeKing7_j0icxf.jpg"
                    alt=""
                    className="w-max h-32 object-cover pl-4 pr-4 rounded-lg "
                  />
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-2xl font-semibold">No comment</div>
        )}
      </motion.div>
    </div>
  )
}

export default UserComment
