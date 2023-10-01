import Head from "next/head"
import React, { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import Header from "../../components/Header"
import { resetPassword } from "../../redux/actions/authAction"
import { useStorage } from "../../utils/hooks"
import { FormSubmit, InputChange, TypedDispatch } from "../../utils/types"
import Lottie from "react-lottie"
import * as location from "../../1127-success.json"
import * as success from "../../79794-world-locations.json"
import { useRouter } from "next/router"
import { ALERT } from "../../redux/types/alertType"

const defaultOptions1 = {
  loop: true,
  autoplay: true,
  animationData: location,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice"
  }
}

const defaultOptions2 = {
  loop: true,
  autoplay: true,
  animationData: success,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice"
  }
}

const ChangePass = () => {
  const [password, setPassword] = React.useState("")
  const [cf_password, setCfPassword] = React.useState("")
  const router = useRouter()
  const dispatch = useDispatch<TypedDispatch>()

  const session = useStorage()
  const email = session.getItem("email", "local")
  if (email === undefined || email === null) {
    router.replace("/forgot-password/error")
    return null
  }

  const [loading, setLoading] = useState<boolean | undefined>(undefined)
  const [completed, setCompleted] = useState<boolean | undefined>(undefined)

  setTimeout(() => {
    setLoading(false)
    setCompleted(true)
  }, 3000)

  const handleSubmit = () => {
    if (password !== cf_password) {
      dispatch({ type: ALERT, payload: { errors: "Password did not match." } })
    }
    dispatch(resetPassword(password, cf_password))
  }

  return (
    <>
      {!completed ? (
        <>
          {!loading ? (
            <Lottie options={defaultOptions2} height={200} width={200} />
          ) : (
            <Lottie options={defaultOptions1} height={100} width={100} />
          )}
        </>
      ) : (
        <>
          <Head>
            <title>Reset Password</title>
          </Head>

          <section className="h-full gradient-form md:h-screen flex justify-center items-center relative text-white">
            <img
              src="https://c4.wallpaperflare.com/wallpaper/913/856/991/sea-luxury-homes-beach-swimming-pool-wallpaper-preview.jpg"
              alt=""
              className="absolute w-full h-full object-cover"
            />
            <form className="w-96 h-fit shadow-lg p-8 bg-gray-700 opacity-80 rounded-md">
              <div className="mb-4">
                <input
                  type="password"
                  className="form-control block w-full px-3 py-1.5 text-base font-normal text-black bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-black focus:bg-white focus:border-blue-600 focus:outline-none"
                  id="password"
                  placeholder="password"
                  value={password}
                  autoComplete="off"
                  onChange={(e: InputChange) => setPassword(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <input
                  type="password"
                  className="form-control block w-full px-3 py-1.5 text-base font-normal text-black bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-black focus:bg-white focus:border-blue-600 focus:outline-none"
                  id="newPassword"
                  placeholder="new password"
                  autoComplete="off"
                  value={cf_password}
                  onChange={(e: InputChange) => setCfPassword(e.target.value)}
                />
              </div>
              <div className="text-center pt-1">
                <button
                  className=" px-6 py-2.5 text-black font-medium text-xs leading-tight uppercase rounded shadow-md hover:text-blue-600 hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out w-1/2 mb-3 bg-white text-center mx-auto block"
                  type="button"
                  data-mdb-ripple="true"
                  data-mdb-ripple-color="light"
                  onClick={handleSubmit}
                >
                  Reset password
                </button>
              </div>
            </form>
          </section>
        </>
      )}
    </>
  )
}

export default ChangePass
