import { IComment } from "../../utils/types"
import { GET_COMMENT, ICommentType } from "../types/commentType"

const commentReducer = (
  state: IComment[] = [],
  action: ICommentType
): IComment[] => {
  switch (action.type) {
    case GET_COMMENT:
      return action.payload
    default:
      return state
  }
}

export default commentReducer
