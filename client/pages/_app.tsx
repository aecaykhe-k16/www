import "aos/dist/aos.css"
import type { AppProps } from "next/app"
import "react-date-range/dist/styles.css"
import "react-date-range/dist/theme/default.css"
import "react-day-picker/dist/style.css"
import { Provider } from "react-redux"
import { Alert } from "../components/alter/Alert"
import store from "../redux/store"
import "../styles/globals.css"
import "react-quill/dist/quill.snow.css"
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Alert />
      <Component {...pageProps} />
    </Provider>
  )
}

export default MyApp
