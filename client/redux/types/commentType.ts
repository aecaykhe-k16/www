import { IComment } from "../../utils/types"

export const GET_COMMENT = "GET_COMMENT"
export const CREATE_COMMENT = "CREATE_COMMENT"

export interface ICommentRe {
  massage?: string
  data?: IComment
  status?: string
}

export interface ICreateComment {
  type: typeof CREATE_COMMENT
  payload: IComment
}

export interface IGetComments {
  type: typeof GET_COMMENT
  payload: IComment[]
}

export type ICommentType = ICreateComment | IGetComments
