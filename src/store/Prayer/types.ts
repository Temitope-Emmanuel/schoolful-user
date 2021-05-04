import {IPrayer, IUserPrayer,IPrayerRequest} from "core/models/Prayer"

export interface PrayerState {
    churchPrayer:IPrayer[];
    prayerRequest:IPrayerRequest[];
}

export enum ActionTypes {
    LOAD_CHURCH_PRAYER = "[PRAYER] Load_Church_Prayer",
    LOAD_PRAYER_REQUEST = "[PRAYER] Load_Prayer_Request",
    CREATE_NEW_PRAYER_REQUEST = "[PRAYER] Create_New_Prayer_Request",
    ADD_USER_TO_PRAYED = "[PRAYER] Add_User_To_Prayed"
}

export interface LoadChurchPrayerAction {
     type:ActionTypes.LOAD_CHURCH_PRAYER,
     payload:IPrayer[]
}

export interface LoadPrayerRequestAction {
    type:ActionTypes.LOAD_PRAYER_REQUEST,
    payload:IPrayerRequest[]
}

export interface AddUserToPrayedAction {
    type:ActionTypes.ADD_USER_TO_PRAYED,
    payload:IUserPrayer
}
export interface CreateNewPrayerRequestAction {
    type:ActionTypes.CREATE_NEW_PRAYER_REQUEST,
    payload:IPrayerRequest
}


export type Action = LoadChurchPrayerAction | LoadPrayerRequestAction 
| AddUserToPrayedAction | CreateNewPrayerRequestAction