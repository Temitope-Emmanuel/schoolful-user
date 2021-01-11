import { SystemState, Action, ActionTypes } from "./types"
import isEmpty from "lodash/isEmpty"

const initialState: SystemState = {
    isAuthenticated: false,
    isLoading:false,
    authLoading:true,
    pageTitle:"",
    currentUser: {
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
        role: []
    },
    currentChurch:{
        churchID: 0,
        name: "",
        address: "",
        churchLogo:"",
        denominationId: 0,
        countryID: 0,
        country:"",
        stateID:0,
        cityID: 0,
        churchStatus: ""
    }
}


export function systemReducer(state = initialState, action: Action): SystemState {
    switch (action.type) {
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