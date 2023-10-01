import React from "react"
import Footer from "../../components/Footer"
import { BiMessageError } from "react-icons/bi"
import Link from "next/link"

const Error = () => {
  return (
    <>
      <header className="bg-slate-300 flex justify-center items-center mb-24">
        <div className="h-24 w-3/4 text-center text-lg text-orange-700 flex justify-center items-center">
          <BiMessageError className="text-3xl text-orange-700" />
          <span>
            Reset password failed. Your reset password link may have expired;
            please send yourself a new sign link.
          </span>
        </div>
      </header>
      <div className="mb-24">
        <p className="text-center text-7xl font-semibold mt-2">
          401 - Unauthorized
        </p>
        <p className="text-center text-2xl font-mono text-slate-500">
          The link you click has expired, please try again.
        </p>
        <div className="text-center mt-10 mb-10">
          <button className="bg-blue-500 h-10 w-2/4 rounded-2xl text-2xl">
            <Link href="/forgot-password">Click here to send a new link</Link>
          </button>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default Error
