import {GroupMessage} from "core/models/Chat"
import {IGroup} from "core/models/Group"

export interface IChatMessageInfo {
    pageSize: number;
    currentPage: number;
    totalPages: number;
    totalRecords: number
}

export interface ChatState {
    currentGroupMessage:GroupMessage[];
    currentGroup:IGroup;
    isLoading:boolean;
    chatMessageInfo:IChatMessageInfo
}

export enum ActionTypes {
    SET_CURRENT_GROUP = "[CHAT] Set_Current_Group",
    SET_CHAT_MESSAGE_INFO = "[CHAT] Set_Chat_Message_Info",
    LOAD_GROUP_MESSAGE = "[CHAT] Load_Group_Message",
    ADD_GROUP_MESSAGE = "[CHAT] Add_Group_Message",
    CLEAR_GROUP_MESSAGE = "[CHAT] Clear_Group_Message",
    SHOW_LOADING = "[CHAT] Show_Loading",
    GET_PREVIOUS_MESSAGE = "[CHAT] Get_Previous_Message",
    HIDE_LOADING = "[CHAT] Hide_Loading"
}


export interface SetCurrentGroupAction {
    type:ActionTypes.SET_CURRENT_GROUP,
    payload:IGroup
}
export interface getPreviousMessageAction {
    type:ActionTypes.GET_PREVIOUS_MESSAGE,
    payload:GroupMessage[]
}
export interface setChatMessageInfoAction {
    type:ActionTypes.SET_CHAT_MESSAGE_INFO,
    payload:IChatMessageInfo
}
export interface loadGroupMessageAction {
    type:ActionTypes.LOAD_GROUP_MESSAGE,
    payload:GroupMessage[]
}

export interface AddMessageToCurrentGroup {
    type:ActionTypes.ADD_GROUP_MESSAGE,
    payload:GroupMessage
}
export interface ClearGroupMessage {
    type:ActionTypes.CLEAR_GROUP_MESSAGE
}

export interface showLoading {
    type:ActionTypes.SHOW_LOADING
}
export interface hideLoading {
    type:ActionTypes.HIDE_LOADING
}

export type Action = SetCurrentGroupAction | AddMessageToCurrentGroup | loadGroupMessageAction 
| ClearGroupMessage | showLoading | hideLoading | getPreviousMessageAction | setChatMessageInfoAction