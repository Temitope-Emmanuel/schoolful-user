import { IPrayerRequest } from "core/models/Prayer"
import {ActionTypes,Action,PrayerState} from "./types"

const initialState:PrayerState = {
    churchPrayer:[],
    prayerRequest:[]
}


export function prayerReducer(state = initialState,action:Action):PrayerState {
    switch(action.type){
        case ActionTypes.LOAD_PRAYER_REQUEST:
            return {
                ...state,
                prayerRequest:action.payload
            }
        case ActionTypes.LOAD_CHURCH_PRAYER:
            return {
                ...state,
                churchPrayer:action.payload
            }
        case ActionTypes.ADD_USER_TO_PRAYED:
            const filteredPrayerRequest = [...state.prayerRequest]
            const foundIdx = filteredPrayerRequest.findIndex(item => item.prayerRequestID === action.payload.prayerRequestID)
            const newPrayerRequest:IPrayerRequest = {
                ...filteredPrayerRequest[foundIdx],
                hasPrayed:true,
                prayedPrayerRequests:[
                    ...filteredPrayerRequest[foundIdx].prayedPrayerRequests || [],
                    action.payload
                ]
            }
            const prayerRequest = filteredPrayerRequest.splice(foundIdx,1,newPrayerRequest)
            return {
                ...state,
                prayerRequest:filteredPrayerRequest
            }
        case ActionTypes.CREATE_NEW_PRAYER_REQUEST:
            return{
                ...state,
                prayerRequest:[...state.prayerRequest,action.payload]
            }
        default:
            return state
    }
}