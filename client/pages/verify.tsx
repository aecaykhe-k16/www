import Head from "next/head"
import { useRouter } from "next/router"
import { useDispatch, useSelector } from "react-redux"
import Footer from "../components/Footer"
import Header from "../components/Header"
import { verify } from "../redux/actions/authAction"
import { RootStore, TypedDispatch } from "../utils/types"

const Verify = () => {
  const { code } = useRouter().query
  const dispatch = useDispatch<TypedDispatch>()

  const handleVerify = async () => {
    dispatch(verify(code as string))
  }

  const { auth } = useSelector((state: RootStore) => state)
  if (auth.data?.accessToken) window.location.href = "/"

  return (
    <>
      <Head>
        <title>Verify account</title>
      </Head>
      <main>
        <Header />
        <div className="ml-40 mr-20 flex space-x-8 py-40">
          {code == undefined ? (
            <h1>PLEASE CHECK YOUR EMAIL TO VERIFY YOUR ACCOUNT.</h1>
          ) : (
            <button
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center flex mx-auto "
              type="button"
              onClick={handleVerify}
            >
              VERIFY YOUR ACCOUNT
            </button>
          )}
        </div>

        <Footer />
      </main>
    </>
  )
}

export default Verify
