import { useEffect, useState } from "react"
import { GrClose } from "react-icons/gr"
import { FormSubmit, IRoom, InputChange } from "../../utils/types"
interface IProps {
  body: IRoom
  showModal: boolean
  setShowModal: (showModal: boolean) => void
  callback: (body: IRoom) => void
}

export default function ModalRoom({
  callback,
  showModal,
  setShowModal,
  body
}: IProps) {
  const [active, setActive] = useState(body)

  const [room, setRoom] = useState<IRoom>()
  useEffect(() => {
    setRoom(body)
  }, [body])
  if (!room) return null

  const handleSubmit = (e: FormSubmit) => {
    e.preventDefault()
    if (!room) return
    callback(room)
    setShowModal(!showModal)
  }
  const handleChange = (e: InputChange) => {
    if (!room) return
    const { name, value } = e.target
    setRoom({ ...room, [name]: value })
  }

  const handleCancel = () => {
    setShowModal(!showModal)
    if (!room) return
  }

  return (
    <>
      {showModal && (
        <>
          <div className="ml-64 mt-0 justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none ">
            <div className="relative w-auto  mx-auto max-w-6xl">
              <form
                className="border-0 rounded-lg shadow-lg relative flex flex-col w-[60rem] bg-white outline-none focus:outline-none flex-1 p-4"
                onSubmit={handleSubmit}
              >
                <div className="grid md:grid-cols-2 md:gap-6">
                  <div className="relative z-0 pt-4 w-full mb-6 group">
                    <input
                      type="text"
                      name="roomName"
                      id="roomName"
                      className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                      placeholder=" "
                      required
                      value={room.roomName}
                      onChange={handleChange}
                    />
                    <label
                      htmlFor="roomName"
                      className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                    >
                      Room name
                    </label>
                  </div>
                  <div className="relative z-0 pt-4 w-full mb-6 group">
                    <input
                      type="text"
                      name="price"
                      id="price"
                      className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                      required
                      value={room.price}
                      onChange={handleChange}
                    />
                    <label
                      htmlFor="price"
                      className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                    >
                      Price
                    </label>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 md:gap-6">
                  <div className="relative z-0 pt-4 w-full mb-6 group">
                    <input
                      type="tel"
                      // pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                      name="limitQuantity"
                      id="limitQuantity"
                      className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                      placeholder=" "
                      required
                      value={room.limitQuantity}
                      onChange={handleChange}
                    />
                    <label
                      htmlFor="limitQuantity"
                      className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                    >
                      Limit person
                    </label>
                  </div>
                  <div className="relative z-0 pt-4 w-full mb-6 group">
                    <input
                      type="text"
                      name="acreage"
                      id="acreage"
                      className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                      placeholder=" "
                      required
                      value={room.acreage}
                      onChange={handleChange}
                    />
                    <label
                      htmlFor="acreage"
                      className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                    >
                      Acreage
                    </label>
                  </div>
                </div>
                <div className="relative z-0 pt-4 w-full mb-6 group">
                  <label className="block mb-2 text-sm font-medium">
                    Description
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    maxLength={500}
                    className="block p-2.5 w-full text-sm rounded-lg border border-gray-300"
                    placeholder="Write your thoughts here..."
                    name="description"
                    value={room.description}
                  ></textarea>
                </div>
                <div className="flex items-center justify-between">
                  <div className="rounded-b">
                    <button
                      className="text-red-700 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={handleCancel}
                    >
                      Cancel
                    </button>
                    <button
                      className="bg-emerald-500 text-white font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="submit"
                    >
                      update
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div
            className="opacity-25 fixed inset-0 z-40 bg-black "
            style={{ marginTop: 0 }}
          ></div>
        </>
      )}
    </>
  )
}
