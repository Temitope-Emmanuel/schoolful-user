import {LiveStreamChurchResponse, StatusType} from "core/models/livestream"

export interface LiveStreamState {
    upComing:LiveStreamChurchResponse[];
    isLive:LiveStreamChurchResponse[];
    completed:LiveStreamChurchResponse[];
    currentStream:LiveStreamChurchResponse
}

export enum ActionTypes {
    ADD_LIVESTREAM_STATUS = "[LIVESTREAM] Add_Livestream",
    REMOVE_LIVESTREAM_STATUS = "[LIVESTREAM] Remove_Livestream",
    ADD_CURRENT_LIVESTREAM = "[LIVESTREAM] Add_Current_Livestream",
    REMOVE_CURRENT_LIVESTREAM = "[LIVESTREAM] Remove_Current_Livestream"
}

export interface AddLiveStreamAction {
    type:ActionTypes.ADD_LIVESTREAM_STATUS,
    payload:{
        status:StatusType,
        data:LiveStreamChurchResponse[]
    }
}
export interface RemoveLiveStreamAction {
    type:ActionTypes.REMOVE_LIVESTREAM_STATUS,
    payload:{
        status:StatusType
    }
}

export interface AddCurrentLivestreamAction {
    type:ActionTypes.ADD_CURRENT_LIVESTREAM,
    payload:LiveStreamChurchResponse
}

export interface RemoveCurrentLivestreamAction {
    type:ActionTypes.REMOVE_CURRENT_LIVESTREAM,
}

export type Action = AddLiveStreamAction | RemoveLiveStreamAction | AddCurrentLivestreamAction | RemoveCurrentLivestreamAction