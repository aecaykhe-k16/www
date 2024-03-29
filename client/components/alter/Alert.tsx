import { useSelector } from "react-redux"
import { RootStore } from "../../utils/types"
import Loading from "./Loading"
import Toast from "./Toast"

export const Alert = () => {
  const { alert } = useSelector((state: RootStore) => state)
  return (
    <div>
      {alert.loading && <Loading />}
      {alert.errors && (
        <Toast title="Errors" body={alert.errors} bgColor="bg-red-500" />
      )}
      {alert.success && (
        <Toast title="Success" body={alert.success} bgColor=" bg-green-500" />
      )}
    </div>
  )
}
