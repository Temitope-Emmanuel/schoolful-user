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
    currentGroupMessage:[],
    isLoading:false
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
        case ActionTypes.CLEAR_GROUP_MESSAGE:
            return {
                ...state,
                currentGroupMessage:[]
            }
        case ActionTypes.SHOW_LOADING:
            return {
                ...state,
                isLoading:true
            }
        case ActionTypes.HIDE_LOADING:
            return {
                ...state,
                isLoading:false
            }
        default:
            return state;
    }
}