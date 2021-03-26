import { GroupMessage } from "core/models/Chat";
import { IGroup } from "core/models/Group";
import { ToastFunc } from "utils/Toast";
import {
    ActionTypes,ClearGroupMessage,
    SetCurrentGroupAction,loadGroupMessageAction
} from "./types"
import {getGroupChat} from "core/services/chat.service"
import { Dispatch } from "redux";
import { AppState } from "store";


export function setChatGroup (currentGroup:IGroup):SetCurrentGroupAction{
    return ({
        type:ActionTypes.SET_CURRENT_GROUP,
        payload:currentGroup
    })
}
export function clearGroupMessage ():ClearGroupMessage{
    return ({
        type:ActionTypes.CLEAR_GROUP_MESSAGE
    })
}

export function addGroupMessage(newMessage:GroupMessage,toast:ToastFunc){
    return async (dispatch:Dispatch,state:() => AppState) => {
        try{
            const newCheckedMessage:GroupMessage = {
                ...newMessage,
                 ownerIsCurrentUser:state().system.currentUser.id === newMessage.personId
            }
            dispatch({
                type:ActionTypes.ADD_GROUP_MESSAGE,
                payload:newCheckedMessage
            })
        }catch(err){
            toast({
                messageType:"error",
                subtitle:`Error:${err}`,
                title:"Something went wrong while sending message"
            })
        }
    }
}

export function loadGroupChatMessage(toast:ToastFunc){
    return async (dispatch:Dispatch,state:() => AppState) => {
        try{
            // dispatch(clearGroupMessage())
            return getGroupChat({
                count:10,
                groupName:state().chat.currentGroup.name,
                page:1,
                take:10
            }).then(payload => {
                const currentUserId = state().system.currentUser.id;
                const checkOwner = payload.data.models.map(item => ({
                    ...item,
                    ownerIsCurrentUser:currentUserId === item.personId
                })).reverse()

                // const sortedPayload = checkOwner.sort((a,b) => {
                //     if(new Date(a.when).getTime() > new Date(b.when).getTime()){
                //         return 1
                //     }else if (new Date(a.when).getTime() < new Date(b.when).getTime()){
                //         return -1
                //     }
                //     return 0
                // })
                
                dispatch<loadGroupMessageAction>({
                    type:ActionTypes.LOAD_GROUP_MESSAGE,
                    payload:checkOwner
                })
            })
        }catch(err){
            toast({
                title:"Unable to get curren group previous message",
                subtitle:`Error:${err}`,
                messageType:"error"
            })
        }
    }
}