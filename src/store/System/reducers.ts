import { SystemState, Action, ActionTypes } from "./types"
import isEmpty from "lodash/isEmpty"
import { IChurch } from "core/models/Church"

const defaultChurch: IChurch = {
    churchID: 0,
    name: "",
    address: "",
    churchLogo:"",
    denomination: "",
    stateName:"",
    cityName:"",
    churchStatus: ""
}

const defaultUser =  {
    id: "",
    auth_token: "",
    fullname: "",
    phoneNumber: 0,
    email: "",
    picture_url:"",
    expirationTime: 0,
    personType: 0,
    callingCode: 0,
    churchId: 0,
    role: [],
    churchMemberID:"",
    personId:""
}

const initialState: SystemState = {
    isAuthenticated: false,
    showAdvertLayout:true,
    isLoading:false,
    authLoading:true,
    pageTitle:"",
    currentUser:defaultUser,
    currentChurch:defaultChurch
}


export function systemReducer(state = initialState, action: Action): SystemState {
    console.log({action})
    switch (action.type) {
        case ActionTypes.SET_ADVERT_LAYOUT:
            return {
                ...state,
                showAdvertLayout:action.payload
            }
        case ActionTypes.CLEAR_CURRENT_CHURCH:
            return{
                ...state,
                currentChurch:defaultChurch
            }
        case ActionTypes.CLEAR_CURRENT_USER:{
            return {
                ...state,
                currentUser:defaultUser
            }
        }
        case ActionTypes.SETCURRENTUSER:
            return {
                ...state,
                currentUser: {
                    ...action.payload
                },
                isAuthenticated: !isEmpty(action.payload)
            };
        case ActionTypes.SET_CURRENT_CHURCH:
            return {
                ...state,
                currentChurch: action.payload
            };
        case ActionTypes.SHOW_SPINNER:
            return {
                ...state,
                isLoading:true
            }
        case ActionTypes.HIDE_SPINNER:
            return {
                ...state,
                isLoading:false
            }
        case ActionTypes.SHOW_AUTH_SPINNER:
            return {
                ...state,
                authLoading:true
            }
        case ActionTypes.HIDE_AUTH_SPINNER:
            return {
                ...state,
                authLoading:false
            }
        case ActionTypes.SET_PAGE_TITLE:
            return {
                ...state,
                pageTitle:action.payload
            }
        default:
            return state;
    }
}