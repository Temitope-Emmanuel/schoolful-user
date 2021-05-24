import { GroupMessage } from "core/models/Chat";
import { IGroup } from "core/models/Group";
import { ToastFunc } from "utils/Toast";
import {
    ActionTypes,ClearGroupMessage,showLoading,hideLoading,IChatMessageInfo,
    SetCurrentGroupAction,loadGroupMessageAction,setChatMessageInfoAction,getPreviousMessageAction
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

export function showChatLoading () : showLoading{
    return({
        type:ActionTypes.SHOW_LOADING
    })
}
export function hideChatLoading () : hideLoading{
    return({
        type:ActionTypes.HIDE_LOADING
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

export function setChatMessageInfo(arg:IChatMessageInfo):setChatMessageInfoAction{
    return({
        type:ActionTypes.SET_CHAT_MESSAGE_INFO,
        payload:arg
    })
}


export function loadGroupChatMessage(toast:ToastFunc,{pageSize,currentPage}:Pick<IChatMessageInfo,"pageSize"|"currentPage">,prev = false){
    return async (dispatch:Dispatch,getState:() => AppState) => {
        dispatch(showChatLoading())
        const {chat:{currentGroup},system:{currentUser}} = getState()
        try{
            return getGroupChat({
                groupName:currentGroup.name,
                page:currentPage,
                take:pageSize
            }).then(({data:{currentPage,pageSize,totalPages,totalRecords,records}}) => {
                const currentUserId = currentUser.id;
                const checkOwner = records!.map(item => ({
                    ...item,
                    ownerIsCurrentUser:currentUserId === item.personId
                }))
                dispatch(hideChatLoading())
                dispatch(setChatMessageInfo({
                    currentPage,totalRecords,
                    totalPages,pageSize
                }))
                if(prev){
                    dispatch<getPreviousMessageAction>({
                        payload:checkOwner,
                        type:ActionTypes.GET_PREVIOUS_MESSAGE
                    })
                }else{
                    dispatch<loadGroupMessageAction>({
                        type:ActionTypes.LOAD_GROUP_MESSAGE,
                        payload:checkOwner
                    })
                }
            })
        }catch(err){
            dispatch(hideChatLoading())
            toast({
                title:"Unable to get curren group previous message",
                subtitle:`Error:${err}`,
                messageType:"error"
            })
        }
    }
}