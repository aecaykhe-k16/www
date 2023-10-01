import { IUser } from "../../utils/types"

export const AUTH = "AUTH"

interface IData {
  accessToken: string
  refreshToken: string
  user: IUser
}

export interface IAuth {
  massage?: string
  data?: IData
  status?: string
}

export interface IAuthType {
  type: typeof AUTH
  payload: IAuth
}
