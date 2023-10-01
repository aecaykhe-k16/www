import { AUTH, IAuth, IAuthType } from "./../types/authType"
import { Dispatch } from "react"
import { IUser, IUserLogin, IUserRegister } from "./../../utils/types"
import { getAPI, postAPI, putAPI } from "../../utils/fecthData"
import { validRegister, validUser } from "../../utils/valid"
import { ALERT, IAlertType } from "../types/alertType"
import { v4 as uuidv4 } from "uuid"

export const login =
  (userLogin: IUserLogin) =>
  async (dispatch: Dispatch<IAuthType | IAlertType>) => {
    try {
      dispatch({ type: ALERT, payload: { loading: true } })

      const res = await postAPI("auth/login", userLogin)
      const userSaveStore: IUser = {
        firstName: res.data.data.firstName,
        lastName: res.data.data.lastName,
        avatar: res.data.data.avatar,
        phone: res.data.data.phone,
        status: false,
        email: res.data.data.email,
        id: "",
        role: res.data.data.role,
        password: ""
      }
      const auth: IAuth = {
        massage: res.data.message,
        data: {
          accessToken: res.data.data.accessToken,
          refreshToken: res.data.data.refreshToken,
          user: userSaveStore
        },
        status: res.data.status
      }

      dispatch({
        type: AUTH,
        payload: auth
      })
      const pathName = localStorage
        .getItem("saveSlugLogin")
        ?.substring(1)
        .split('"')[0]
      window.location.href = pathName ? pathName : "/"
      localStorage.setItem("logged", `user-${res.data.data.refreshToken}`)

      dispatch({ type: ALERT, payload: { success: res.data.message } })
    } catch (error: any) {
      dispatch({ type: ALERT, payload: { errors: "User not found" } })
    }
  }
export const refreshToken =
  () => async (dispatch: Dispatch<IAuthType | IAlertType>) => {
    const logged = localStorage.getItem("logged")

    if (logged?.substring(0, 4) !== "user") return
    try {
      const res = await getAPI("auth/refresh", `${logged.substring(5)}`)
      const userSaveStore: IUser = {
        firstName: res.data.data.firstName,
        lastName: res.data.data.lastName,
        avatar: res.data.data.avatar,
        phone: res.data.data.phone,
        status: false,
        email: res.data.data.email,
        id: "",
        role: res.data.data.role,
        password: ""
      }
      const auth: IAuth = {
        massage: res.data.message,
        data: {
          accessToken: res.data.data.accessToken,
          refreshToken: res.data.data.refreshToken,
          user: userSaveStore
        },
        status: res.data.status
      }

      dispatch({
        type: AUTH,
        payload: auth
      })

      localStorage.setItem("logged", `user-${res.data.data.refreshToken}`)
      dispatch({ type: ALERT, payload: {} })
    } catch (err: any) {
      console.log(err)
    }
  }
export const logout =
  () => async (dispatch: Dispatch<IAuthType | IAlertType>) => {
    const logged = localStorage.getItem("logged")

    if (logged?.substring(0, 4) !== "user") return
    try {
      const res = await getAPI("auth/logout", `${logged.substring(5)}`)
      if (res.status != 200)
        dispatch({ type: ALERT, payload: { success: res.data.message } })
      localStorage.removeItem("logged")

      window.location.href = "/"
      dispatch({ type: AUTH, payload: {} })
      dispatch({ type: ALERT, payload: { success: "You logout successfully" } })
    } catch (err: any) {
      console.log(err)
    }
  }
export const register =
  (user: IUserRegister) =>
  async (dispatch: Dispatch<IAuthType | IAlertType>) => {
    const checkRegisger = validRegister(user)
    if (checkRegisger.errLength > 0)
      dispatch({ type: ALERT, payload: { errors: checkRegisger.errMsg } })
    try {
      dispatch({ type: ALERT, payload: { loading: true } })
      const newUser = { id: uuidv4(), ...user }
      const res = await postAPI("auth/register", newUser)
      const userSaveStore: IUser = {
        firstName: res.data.data.firstName,
        lastName: res.data.data.lastName,
        avatar: res.data.data.avatar,
        phone: res.data.data.phone,
        status: false,
        email: res.data.data.email,
        id: "",
        role: res.data.data.role,
        password: ""
      }
      const auth: IAuth = {
        massage: res.data.message,
        data: {
          accessToken: res.data.data.accessToken,
          refreshToken: res.data.data.refreshToken,
          user: userSaveStore
        },
        status: res.data.status
      }

      dispatch({
        type: AUTH,
        payload: auth
      })
      dispatch({ type: ALERT, payload: { loading: false } })

      if (res.data.err) {
        dispatch({ type: ALERT, payload: { errors: res.data.message } })
        return
      } else window.location.href = "/verify"

      dispatch({ type: ALERT, payload: { success: res.data.message } })
    } catch (err: any) {
      // dispatch({ type: ALERT, payload: { errors: err.response.data.message } })
      console.log(err)
    }
  }

export const forgotPassword =
  (email: string) => async (dispatch: Dispatch<IAlertType>) => {
    try {
      dispatch({ type: ALERT, payload: { loading: true } })

      const res = await postAPI("auth/forgot-password", { email })
      dispatch({ type: ALERT, payload: { success: "Please check your email" } })
    } catch (err: any) {
      dispatch({ type: ALERT, payload: { errors: err.response.data.message } })
    }
  }

export const resetPassword =
  (password: string, cfPassword: string) =>
  async (dispatch: Dispatch<IAlertType>) => {
    try {
      const email = localStorage.getItem("email")

      dispatch({ type: ALERT, payload: { loading: true } })

      const res = await putAPI("auth/forgot-password", {
        password,
        cfPassword,
        email
      })
      if (res) {
        localStorage.removeItem("email")
        window.location.href = "/login"
      }
      dispatch({ type: ALERT, payload: { success: "Password changed" } })
    } catch (err: any) {
      dispatch({ type: ALERT, payload: { errors: err.response.data.message } })
    }
  }

export const verify =
  (code: string) => async (dispatch: Dispatch<IAlertType | IAuthType>) => {
    try {
      dispatch({ type: ALERT, payload: { loading: true } })
      const res = await getAPI(`auth/verify?code=${code}`)
      dispatch({
        type: AUTH,
        payload: res.data
      })

      window.location.href = "/"
      localStorage.setItem("logged", `user-${res.data.data.refreshToken}`)

      dispatch({ type: ALERT, payload: { success: res.data.message } })
    } catch (err: any) {
      dispatch({ type: ALERT, payload: { errors: err.response.data.message } })
    }
  }

export const updateProfile =
  (user: IUser) => async (dispatch: Dispatch<IAuthType | IAlertType>) => {
    const checkRegisger = validUser(user)
    if (checkRegisger.errLength > 0)
      dispatch({ type: ALERT, payload: { errors: checkRegisger.errMsg } })
    try {
      dispatch({ type: ALERT, payload: { loading: true } })
      const res = await putAPI("users/update", user)
      if (res.data.err) {
        dispatch({ type: ALERT, payload: { errors: res.data.message } })
        return
      }

      dispatch({ type: ALERT, payload: { success: res.data.message } })
    } catch (err: any) {
      dispatch({ type: ALERT, payload: { errors: err.response.data.message } })
    }
  }
