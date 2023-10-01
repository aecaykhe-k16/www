import { ChangeEvent, FormEvent, MouseEventHandler } from "react"
import { useDispatch } from "react-redux"
import { AnyAction } from "redux"
import { ThunkDispatch } from "redux-thunk"
import rootReducer from "../redux/reducers"

export type RootStore = ReturnType<typeof rootReducer>

export type TypedDispatch = ThunkDispatch<RootStore, any, AnyAction>

export type Handler = MouseEventHandler<HTMLHeadingElement>

export type FormSubmit = FormEvent<HTMLFormElement>
export type InputChange = ChangeEvent<
  HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | HTMLSelectElement
>
export interface IAlert {
  loading?: boolean
  success?: string | string[]
  errors?: string | string[]
}

export interface IUserLogin {
  email: string
  password: string
}
export interface IUserRegister extends IUserLogin {
  lastName: string
  firstName: string
  cf_password: string
}

export interface IUser extends IUserLogin {
  firstName: string
  lastName: string
  avatar: string
  phone: string
  status: boolean
  id: string
  role: string
  enabled?: boolean
}

export interface IRoom {
  room_ID: string
  roomName: string
  price: number
  limitQuantity: string
  description: string
  acreage: number
  images: string[]
  vote: number
  service?: IService[]
  services?: string[]
  type_ID?: string
  roomType?: IRoomType
}

export interface IService {
  id: string
  name: string
}
export interface IIMg {
  id: string
  author: string
  width: number
  height: number
  url: string
  download_url: string
}

export interface ICart {
  checkIn: Date
  checkOut: Date
  quantity: number
  user?: IUser
  rooms: IRoom
  unitPrice: number
}

export interface IBill {
  bill_ID: string
  date: Date
  total: number
  user_ID?: string
  billDetails?: ICart[]
}
export interface IBillDetail {
  bill_ID: string
  room_ID: string
  check_in: Date
  check_out: Date
  unit_price: number
}

export interface IRoomChecked extends IRoom {
  isChecked: boolean
  checkIn: Date
  checkOut: Date
}

export interface IRoomType {
  type_ID: string
  typeName: string
  type: string
}

export interface IRoomOfRoomType extends IRoomType {
  rooms: IRoom[]
}

interface INameTypeRoom {
  id: string
  name: string
}
export interface IRoomTypeConvert {
  id?: string
  type: string
  names: INameTypeRoom[]
}

export interface IComment {
  email?: string
  room_ID?: string
  comment?: string
  point?: number
  image?: string
  createdAt?: Date
}

export interface IDataForStatistic {
  name: string
  expense: number
  income: number
}

export interface ICheckDate {
  checkIn: Date
  checkOut: Date
}

export interface IDetailAdmin {
  room_id: string
  check_out: string
  room_name: string
  total_price: string
  phone: string
  check_in: string
  fullName: string
  unit_price: string
  email: string
}

export type StorageType = "session" | "local"
export type UseStorageReturnValue = {
  getItem: (key: string, type?: StorageType) => string
  setItem: (key: string, value: string, type?: StorageType) => boolean
  removeItem: (key: string, type?: StorageType) => void
}
