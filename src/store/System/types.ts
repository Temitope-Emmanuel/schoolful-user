import {LoggedInUser} from "core/models/LoggedInUser"
import {IChurch} from "core/models/Church"

export interface SystemState {
    isAuthenticated:boolean;
    isLoading:boolean;
    authLoading:boolean;
    pageTitle:string;
    currentUser:LoggedInUser;
    currentChurch:IChurch;
    showAdvertLayout:boolean
}


export enum ActionTypes {
    SHOW_SPINNER = "[System] Show_Spinner",
    HIDE_SPINNER = "[System] Hide_Spinner",
    SHOW_AUTH_SPINNER = "[System] Show_Auth_Spinner",
    HIDE_AUTH_SPINNER = "[System] Hide_Auth_Spinner",
    LOGIN = "[System] Login",
    SETCURRENTUSER = "[System] SetCurrentUser",
    SET_CURRENT_CHURCH = "[System] SetCurrentChurch",
    SET_PAGE_TITLE = "[System] SetPageTitle",
    SET_ADVERT_LAYOUT = "[System] SetAdvertLayout"
}

export interface SetChurchAction {
    type:ActionTypes.SET_CURRENT_CHURCH,
    payload:IChurch
}
export interface ShowSpinnerAction {
    type:ActionTypes.SHOW_SPINNER
}
export interface SetAdvertLayoutAction {
    type:ActionTypes.SET_ADVERT_LAYOUT,
    payload:boolean
}
export interface HideSpinnerAction {
    type:ActionTypes.HIDE_SPINNER
}
export interface ShowAuthSpinnerAction {
    type:ActionTypes.SHOW_AUTH_SPINNER
}
export interface HideAuthSpinnerAction {
    type:ActionTypes.HIDE_AUTH_SPINNER
}
export interface SetTitleAction {
    type:ActionTypes.SET_PAGE_TITLE,
    payload:string
}
export interface LoginAction {
    type: ActionTypes.LOGIN,
    payload: string
}
export interface SetCurrentUserAction {
    type: ActionTypes.SETCURRENTUSER,
    payload: any
} 

export type Action = HideSpinnerAction  | LoginAction | SetCurrentUserAction | SetChurchAction |SetAdvertLayoutAction 
| ShowSpinnerAction | HideSpinnerAction | SetTitleAction | ShowAuthSpinnerAction |HideAuthSpinnerAction