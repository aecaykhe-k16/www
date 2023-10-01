import { useRouter } from "next/router"
import React from "react"
import { getAPI } from "../../utils/fecthData"
import Head from "next/head"
import Header from "../../components/Header"
import Footer from "../../components/Footer"

const Confirm = () => {
  const { slug } = useRouter().query
  const handleVerify = async () => await getAPI("auth/verify?code=" + slug)

  return (
    <>
      <Head>
        <title>room</title>
      </Head>
      <main>
        <Header />
        <div className="ml-40 mr-20 flex space-x-8 py-40">
          <button
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center flex mx-auto "
            type="button"
            onClick={handleVerify}
          >
            VERIFY
          </button>
        </div>

        <Footer />
      </main>
    </>
  )
}

export default Confirm
