import {ChatState,Action,ActionTypes} from "./types"

const initialState:ChatState = {
    currentGroup:{
        churchId:0,
        denominationId:0,
        description:"",
        isDeleted:false,
        memberCount:0,
        name:""
    },
    currentGroupMessage:[]
}

export function chatReducer(state = initialState,action:Action):ChatState {
    switch(action.type){
        case ActionTypes.ADD_GROUP_MESSAGE:
            return {
                ...state,
                currentGroupMessage:[...state.currentGroupMessage,action.payload]
            }
        case ActionTypes.LOAD_GROUP_MESSAGE:
            return {
                ...state,
                currentGroupMessage:[...state.currentGroupMessage,...action.payload]
            }
        case ActionTypes.SET_CURRENT_GROUP:
            return {
                ...state,
                currentGroup:action.payload
            }
        default:
            return state;
    }
}