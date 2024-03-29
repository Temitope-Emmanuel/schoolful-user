import {ActionTypes,SetTitleAction,SetChurchAction,SetAdvertLayoutAction} from "./types"
import {Dispatch} from "redux"
import {getChurchById} from "core/services/church.service"
import {getUserChurchInfo} from "core/services/account.service"
import * as userService from "core/services/user.service"
import * as auth from "utils/auth"
import history from "utils/history"
import {IChurch} from "core/models/Church"
import {ToastFunc} from "utils/Toast"
import {MessageType} from "core/enums/MessageType"
import {AppState} from "store"
import { LoggedInUser } from "core/models/LoggedInUser"

export function getChurch(toast:ToastFunc) {
    return async(dispatch:Dispatch,state:() => AppState) => {
        try{
            
            return await getChurchById(state().system.currentUser.churchId).then(payload => {
                dispatch<SetChurchAction>({
                    type:ActionTypes.SET_CURRENT_CHURCH,
                    payload:payload.data
                })
            })
        }catch(err){
            toast({
                title:"Unable to get Church Detail",
                subtitle:`Error: ${err}`,
                messageType:MessageType.ERROR
            })
        }
    }
}


export function setAdvertLayout(arg:boolean):SetAdvertLayoutAction{
    return {
        type:ActionTypes.SET_ADVERT_LAYOUT,
        payload:arg
    }
}

export function login(phoneNumber:number,password:string,toast:ToastFunc){
    return async function(dispatch:any){
        dispatch(showLoading())
        try{
            return await userService.login(phoneNumber,password).then(payload => {
                dispatch(hideLoading())
                // const {refreshToken,...userDetail} = payload.data;
                // auth.saveUserDetail(JSON.stringify(userDetail))
                // auth.saveToken(refreshToken)
                // return dispatch(
                //     setCurrentUser(JSON.parse(auth.getUserDetail() as string),
                //     toast,() => {history.push(`/church/${payload.data.churchId}/home`)})
                //     )
                history.push(`/church/1/home`)
            })
        }catch(err){
            console.log('this si the err',{err})
            dispatch(hideLoading())
            toast({
                title:"Error",
                subtitle:` Unable to Login User :${err}`,
                messageType:MessageType.ERROR,
            })
        }
    }
}

export function logout(redirect = true) {
        auth.removeToken()
        auth.removeUserDetail()
        clearCurrentChurch()
        clearCurrentUser()
        if(redirect){
            history.push("/login")
        }
}

export function setCurrentUser(user:LoggedInUser,toast:ToastFunc,func?:any) {
    return async function (dispatch:Dispatch){
        try{
            return await getUserChurchInfo(user.id).then(payload => {
                if(payload.data && payload.data.length){
                    const {church,...userDetail} = payload.data[0]
                    dispatch({
                        type:ActionTypes.SETCURRENTUSER,
                        payload:{
                            ...user,
                            ...userDetail
                        }
                    })
                    dispatch(hideAuthLoading())
                    if(func){
                        console.log("calling this function",{func})
                        func()
                    }
                }
            })
        }catch(err){
            toast({
                title:"Unable to complete request to get user detail",
                subtitle:`Error:${err}`,
                messageType:"error"
            })
        }
    }
}

export function clearCurrentUser () {
    return{
        type:ActionTypes.CLEAR_CURRENT_USER
    }
}
export function clearCurrentChurch () {
    return{
        type:ActionTypes.CLEAR_CURRENT_CHURCH
    }
}
export function setCurrentChurch(church:IChurch){
    return{
        type:ActionTypes.SET_CURRENT_CHURCH,
        payload:church
    }
}
export function showLoading(){
    return{
        type:ActionTypes.SHOW_SPINNER
    }
}
export function hideLoading(){
    return{
        type:ActionTypes.HIDE_SPINNER
    }
}
export function showAuthLoading(){
    return{
        type:ActionTypes.HIDE_AUTH_SPINNER
    }
}
export function hideAuthLoading(){
    console.log("callling this func")
    return{
        type:ActionTypes.HIDE_AUTH_SPINNER
    }
}
export function setPageTitle(newTitle:string):SetTitleAction{
    return{
        payload:newTitle,
        type:ActionTypes.SET_PAGE_TITLE
    }
}