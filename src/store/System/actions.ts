import {ActionTypes,SetTitleAction,SetChurchAction} from "./types"
import {Dispatch} from "redux"
// import * as accountService from "core/services/account.service"
import {getChurchById} from "core/services/church.service"
import * as userService from "core/services/user.service"
import * as auth from "utils/auth"
import history from "utils/history"
import {IChurch} from "core/models/Church"
import {ToastFunc} from "utils/Toast"
import {MessageType} from "core/enums/MessageType"
import {AppState} from "store"

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


export function login(phoneNumber:number,password:string,toast:ToastFunc){
    return async function(dispatch:Dispatch){
        dispatch(showLoading())
        try{
            return await userService.login(phoneNumber,password).then(payload => {
                dispatch(hideLoading())
                const {refreshToken,...userDetail} = payload.data;
                auth.saveUserDetail(JSON.stringify(userDetail))
                auth.saveToken(refreshToken)
                dispatch(setCurrentUser(JSON.parse(auth.getUserDetail() as string)))
                history.push(`/church/${payload.data.churchId}/home`)
            })
        }catch(err){
            dispatch(hideLoading())
            toast({
                title:"Error",
                subtitle:` Unable to Login User :${err}`,
                messageType:MessageType.ERROR,
            })
        }
    }
}

export function logout() {
        auth.removeToken()
        auth.removeUserDetail()
        setCurrentUser({})
        setCurrentChurch({})
        history.push("/login")
}
export function setCurrentUser(user:any) {
    return{
        type:ActionTypes.SETCURRENTUSER,
        payload:user
    }
}
export function setCurrentChurch(church:IChurch | any){
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