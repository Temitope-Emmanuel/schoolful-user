import {GroupMessage} from "core/models/Chat"
import {IGroup} from "core/models/Group"

export interface ChatState {
    currentGroupMessage:GroupMessage[];
    currentGroup:IGroup;
}

export enum ActionTypes {
    SET_CURRENT_GROUP = "[GROUP] Set_Current_Group",
    LOAD_GROUP_MESSAGE = "[GROUP] Load_Group_Message",
    ADD_GROUP_MESSAGE = "[GROUP] Add_Group_Message",
    CLEAR_GROUP_MESSAGE = "[GROUP] Clear_Group_Message"
}


export interface SetCurrentGroupAction {
    type:ActionTypes.SET_CURRENT_GROUP,
    payload:IGroup
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

export type Action = SetCurrentGroupAction | AddMessageToCurrentGroup | loadGroupMessageAction | ClearGroupMessage