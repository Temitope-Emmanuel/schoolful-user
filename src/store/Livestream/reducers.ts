import {Action,ActionTypes,LiveStreamState} from "./types"


const initialState:LiveStreamState = {
    completed:[],
    isLive:[],
    upComing:[],
    currentStream:{
        channelID:"",
        churchID:0,
        description:"",
        eventID:0,
        liveBroadcastID:"",
        liveChatID:"",
        liveStreamID:"",
        privacyStatus:"",
        publishedOn:"",
        scheduledEndTime:"",
        scheduledStartTime:"",
        status:"Upcoming",
        title:"",
        url:""    
    }
}

export function livestreamReducer(state = initialState,action:Action): LiveStreamState {
    switch(action.type){
        case ActionTypes.ADD_LIVESTREAM_STATUS:
            return {
                ...state,
                [action.payload.status]:action.payload.data
            }
        case ActionTypes.ADD_CURRENT_LIVESTREAM:{
            return {
                ...state,
                currentStream:action.payload
            }
        }
        case ActionTypes.REMOVE_LIVESTREAM_STATUS:{
            return {
                ...state,
                [action.payload.status]:[]
            }
        }
        case ActionTypes.REMOVE_CURRENT_LIVESTREAM:{
            return {
                ...state,
                currentStream:initialState.currentStream
            }
        }
        default:
            return state
    }
}