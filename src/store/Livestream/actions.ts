import {ActionTypes,AddLiveStreamAction,AddCurrentLivestreamAction} from "./types"
import {Dispatch} from "redux"
import * as livestreamService from "core/services/livestream.service"
import {AppState} from "store"
import {ToastFunc} from "utils/Toast"
import { CancelTokenSource } from "axios"
import { StatusType } from "core/models/livestream"


export function getPendingStream(status:StatusType,toast:ToastFunc,cancelToken?:CancelTokenSource){
    return async (dispatch:Dispatch,getState:() => AppState) => {
        try{
            const state = getState()
            return await livestreamService.getBroadcastByStatus({
                cancelToken:cancelToken,
                churchId:state.system.currentChurch.churchID as any,
                status
            }).then(payload => {
                dispatch<AddLiveStreamAction>({
                    type:ActionTypes.ADD_LIVESTREAM_STATUS,
                    payload:{
                        data:payload.data,
                        status
                    }
                })
            })
        }catch(err){
            toast({
                title:"Unable to complete request",
                subtitle:`Error:${err}`,
                messageType:"error"
            })
        }
    }
}

export function setCurrentStream({
    broadCastID,toast
}:{
    broadCastID:string;
    toast:ToastFunc
}){
    return async (dispatch:Dispatch,getState:() => AppState) => {
        try{
            const state = getState()
            return await livestreamService.getBroadcastByID({
                broadcastId:broadCastID,
                churchID:state.system.currentChurch.churchID as any
            }).then(payload => {
                dispatch<AddCurrentLivestreamAction>({
                    type:ActionTypes.ADD_CURRENT_LIVESTREAM,
                    payload:payload.data
                })
            })
        }catch(err){
            toast({
                title:"Unable to complete request",
                subtitle:`Error:${err}`,
                messageType:"error"
            })
        }
    }
}