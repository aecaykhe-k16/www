import { Dispatch } from "react"
import { getAPI, postAPI, putAPI } from "../../utils/fecthData"
import { ALERT, IAlertType } from "../types/alertType"
import { IRoom } from "./../../utils/types"
import {
  CREATE_ROOM,
  DELETE_ROOM,
  GET_ROOM,
  IRoomType,
  UPDATE_ROOM
} from "./../types/roomType"
import { v4 as uuidv4 } from "uuid"

export const getRooms =
  () => async (dispatch: Dispatch<IRoomType | IAlertType>) => {
    try {
      dispatch({ type: ALERT, payload: { loading: true } })
      const res = await getAPI("rooms")
      dispatch({
        type: GET_ROOM,
        payload: res.data.data
      })
      dispatch({ type: ALERT, payload: {} })
    } catch (error: any) {
      console.log(error)
    }
  }

export const getRoom =
  (id: string) => async (dispatch: Dispatch<IRoomType | IAlertType>) => {
    try {
      dispatch({ type: ALERT, payload: { loading: true } })
      const res = await getAPI(`rooms/${id}`)
      dispatch({
        type: GET_ROOM,
        payload: res.data.data
      })
      dispatch({ type: ALERT, payload: {} })
    } catch (error: any) {
      console.log(error)
    }
  }

export const createRoom =
  (newRoom: IRoom) => async (dispatch: Dispatch<IRoomType | IAlertType>) => {
    try {
      dispatch({ type: ALERT, payload: { loading: true } })
      newRoom.room_ID = uuidv4()
      newRoom.price = Number(newRoom.price)
      newRoom.acreage = Number(newRoom.acreage)

      newRoom.services = newRoom.service?.map((service) => {
        return service.name
      })
      delete newRoom.service
      await postAPI("rooms/add", newRoom)
      dispatch({
        type: CREATE_ROOM,
        payload: newRoom
      })

      dispatch({ type: ALERT, payload: { success: "Create successfully" } })
    } catch (err: any) {
      console.log(err)
    }
  }

export const updateRoom =
  (newRoom: IRoom) => async (dispatch: Dispatch<IRoomType | IAlertType>) => {
    try {
      dispatch({ type: ALERT, payload: { loading: true } })

      const res = await putAPI("rooms/update", newRoom)
      console.log(res)
      dispatch({
        type: UPDATE_ROOM,
        payload: newRoom
      })

      dispatch({ type: ALERT, payload: { success: "Update successfully" } })
    } catch (err: any) {
      console.log(err)
    }
  }

export const deleteRoom =
  (id: string) => async (dispatch: Dispatch<IRoomType | IAlertType>) => {
    try {
      dispatch({ type: ALERT, payload: { loading: true } })
      // const res = await postAPI("auth/update", Room)

      dispatch({
        type: DELETE_ROOM,
        payload: id
      })

      dispatch({ type: ALERT, payload: { success: "Delete successfully" } })
    } catch (err: any) {
      console.log(err)
    }
  }

export const getPopularRooms =
  () => async (dispatch: Dispatch<IRoomType | IAlertType>) => {
    try {
      dispatch({ type: ALERT, payload: { loading: true } })
      const res = await getAPI("rooms/popular")
      dispatch({
        type: GET_ROOM,
        payload: res.data.data
      })
      dispatch({ type: ALERT, payload: {} })
    } catch (error: any) {
      console.log(error)
    }
  }
