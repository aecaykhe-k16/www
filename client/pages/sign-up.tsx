import Head from "next/head"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { refreshToken, register } from "../redux/actions/authAction"
import {
  FormSubmit,
  IUser,
  IUserRegister,
  InputChange,
  RootStore,
  TypedDispatch
} from "../utils/types"
import { getUsers } from "../redux/actions/userAction"
import { ALERT } from "../redux/types/alertType"
import { getAPI, getID } from "../utils/fecthData"

const Register = () => {
  const dispatch = useDispatch<TypedDispatch>()
  const [checkEmail, setCheckEmail] = useState(false)
  const [mailNotVerify, setMailNotVerify] = useState(false)
  useEffect(() => {
    dispatch(refreshToken())
    dispatch(getUsers())
  }, [dispatch])

  const { auth, users } = useSelector((state: RootStore) => state)
  if (auth.data?.accessToken) window.location.href = "/"
  const initalState: IUserRegister = {
    lastName: "",
    firstName: "",
    email: "",
    password: "",
    cf_password: ""
  }

  const [userRegister, setUserRegister] = useState(initalState)
  const { lastName, firstName, password, cf_password, email } = userRegister

  const handleChangeInput = (e: InputChange) => {
    const { name, value } = e.target
    setUserRegister({
      ...userRegister,
      [name]: value
    })

    if (name === "email") {
      if (!value) return setCheckEmail(false)
      const check: IUser | undefined = users.find(
        (user) => user.email === value
      )
      if (check) {
        check.enabled == true ? setCheckEmail(true) : setMailNotVerify(true)
      }
    }
  }

  const handleSubmit = (e: FormSubmit) => {
    e.preventDefault()
    dispatch(register(userRegister))
  }

  if (auth.data?.accessToken) {
    window.location.href = "/"
  }
  return (
    <>
      <Head>
        <title>Đăng ký</title>
      </Head>
      <section className="h-screen">
        <div className="px-6 h-full text-gray-800">
          <div className="flex xl:justify-center lg:justify-between justify-center items-center flex-wrap h-full g-6">
            <div className="grow-0 shrink-1 md:shrink-0 basis-auto xl:w-6/12 lg:w-6/12 md:w-9/12 mb-12 md:mb-0">
              <img
                src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
                className="w-full"
                alt=""
              />
            </div>
            <div className="xl:ml-20 xl:w-5/12 lg:w-5/12 md:w-8/12 mb-12 md:mb-0">
              <form onSubmit={handleSubmit}>
                <div className="grid md:grid-cols-2 md:gap-6">
                  <div className="mb-6">
                    <label htmlFor="" className="text-xl font-semibold px-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                      onChange={handleChangeInput}
                      value={firstName}
                      name="firstName"
                      autoComplete="name"
                    />
                  </div>
                  <div className="mb-6">
                    <label htmlFor="" className="text-xl font-semibold px-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                      onChange={handleChangeInput}
                      value={lastName}
                      name="lastName"
                      autoComplete="name"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label htmlFor="" className="text-xl font-semibold px-1">
                    Email
                  </label>
                  <input
                    type="text"
                    className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                    autoComplete="email"
                    onChange={handleChangeInput}
                    value={email}
                    name="email"
                  />
                  {checkEmail ? (
                    <small className="text-red-500">Email already exists</small>
                  ) : (
                    mailNotVerify && (
                      <small className="text-red-500">
                        Email not verify. Please check your email
                      </small>
                    )
                  )}
                </div>

                <div className="mb-6">
                  <label htmlFor="" className="text-xl font-semibold px-1">
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                    autoComplete="new-password"
                    onChange={handleChangeInput}
                    value={password}
                    name="password"
                  />
                </div>
                <div className="mb-6">
                  <label htmlFor="" className="text-xl font-semibold px-1">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                    autoComplete="new-password"
                    onChange={handleChangeInput}
                    value={cf_password}
                    name="cf_password"
                  />
                </div>

                <div className="text-center lg:text-left">
                  <button
                    type="submit"
                    className="inline-block px-7 py-3 bg-blue-600 text-white font-medium text-sm leading-snug uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
                  >
                    Sign Up
                  </button>
                  <p className="text-sm font-semibold mt-2 pt-1 mb-0">
                    You have an account?
                    <Link
                      href="/login"
                      className="ml-1 text-red-600 hover:text-red-700 focus:text-red-700 transition duration-200 ease-in-out"
                    >
                      Login
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Register
