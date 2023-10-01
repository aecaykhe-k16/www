import { Dispatch } from "react"
import { getAPI, postAPI } from "../../utils/fecthData"
import { IComment } from "../../utils/types"
import { ALERT, IAlertType } from "../types/alertType"
import { CREATE_COMMENT, GET_COMMENT, ICommentType } from "../types/commentType"

export const getComments =
  () => async (dispatch: Dispatch<ICommentType | IAlertType>) => {
    try {
      dispatch({ type: ALERT, payload: { loading: true } })
      const res = await getAPI("comments")
      dispatch({
        type: GET_COMMENT,
        payload: res.data.data
      })
      dispatch({ type: ALERT, payload: {} })
    } catch (error: any) {
      console.log(error)
    }
  }

export const createComment =
  (newComment: IComment, accessToken: string) =>
  async (dispatch: Dispatch<ICommentType | IAlertType>) => {
    try {
      dispatch({ type: ALERT, payload: { loading: true } })

      await postAPI("comments/add", newComment, accessToken)
      dispatch({
        type: CREATE_COMMENT,
        payload: newComment
      })

      dispatch({ type: ALERT, payload: { success: "Create successfully" } })
    } catch (err: any) {
      dispatch({ type: ALERT, payload: { errors: err.response.data.message } })
    }
  }
