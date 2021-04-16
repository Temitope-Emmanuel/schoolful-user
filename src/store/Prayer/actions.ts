import {ActionTypes,LoadChurchPrayerAction,CreateNewPrayerRequestAction,LoadPrayerRequestAction,AddUserToPrayedAction} from "./types"
import {Dispatch} from "redux"
import * as prayerService from "core/services/prayer.service"
import {ToastFunc} from "utils/Toast"
import axios, { CancelTokenSource } from "axios"
import {formatDistanceToNow} from "date-fns"
import { AppState } from "store"
import { IPrayerRequest } from "core/models/Prayer"


export function loadChurchPrayer({
    cancelToken,churchId,toast
}:{
    churchId:number;
    cancelToken:CancelTokenSource;
    toast:ToastFunc
}){
    return async (dispatch:Dispatch) => {
        prayerService.getPrayer(churchId, cancelToken).then(payload => {
            dispatch<LoadChurchPrayerAction>({
                type:ActionTypes.LOAD_CHURCH_PRAYER,
                payload:payload.data
            })
        }).catch(err => {
            if (!axios.isCancel(err)) {
                toast({
                    title: "Unable to Get Church Prayers",
                    subtitle: `Error:${err}`,
                    messageType: "error"
                })
            }
        })
    }
}

export function loadChurchPrayerRequest({
    cancelToken,churchId,toast
}:{
    churchId:number;
    cancelToken:CancelTokenSource;
    toast:ToastFunc
}){
    return async (dispatch:Dispatch,getState:() => AppState) => {
        prayerService.getPrayerRequest(churchId, cancelToken).then(payload => {
            const state = getState()
            const prayerRequest = payload.data.map(item => ({
                ...item,
                dateEntered:formatDistanceToNow(new Date(item.dateEntered)),
                hasPrayed: Boolean(item.prayedPrayerRequests!.find(item => item.fullName === state.system.currentUser.fullname))
            }))
            dispatch<LoadPrayerRequestAction>({
                type:ActionTypes.LOAD_PRAYER_REQUEST,
                payload:prayerRequest
            })
        }).catch(err => {
            if (!axios.isCancel(err)) {
                toast({
                    title: "Unable to Get Prayers Request",
                    subtitle: `Error:${err}`,
                    messageType: "error"
                })
            }
        })
    }
}

export function addUserToHasPrayed({
    toast,prayerId
}:{
    prayerId:number;
    toast:ToastFunc
}){
    return async (dispatch:Dispatch,getState:() => AppState) => {
        const {system:{currentUser}} = getState()
        prayerService.prayerForPrayerRequest(prayerId,currentUser.id).then(payload => {
            dispatch<AddUserToPrayedAction>({
                type:ActionTypes.ADD_USER_TO_PRAYED,
                payload:{
                    fullName:currentUser.fullname,
                    personPrayedId:currentUser.id,
                    personPrayedPictureUrl:currentUser.picture_url || "",
                    pictureUrl:"",
                    prayedPrayerRequestID:new Date().getTime(),
                    prayerRequestID:prayerId
                }
            })
        }).catch(err => {
            toast({
                title:"Unable to add to prayer Request",
                subtitle:`Error:${err}`,
                messageType:"error"
            })
        })
    }
}
export function createNewPrayerRequest(arg:IPrayerRequest,toast:ToastFunc){
    return async (dispatch:Dispatch) => {
        prayerService.addPrayerRequest(arg).then(payload => {
            dispatch<CreateNewPrayerRequestAction>({
                type:ActionTypes.CREATE_NEW_PRAYER_REQUEST,
                payload:payload.data
            })
        }).catch(err => {
            toast({
                title:"Unable to create new prayer Request",
                subtitle:`Error:${err}`,
                messageType:"error"
            })
        })
    }
}