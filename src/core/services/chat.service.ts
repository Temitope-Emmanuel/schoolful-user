import axios,{AxiosRequestConfig} from "axios"
import {IResponse} from "core/models/Response"
import {GetGroupChat,GroupMessage} from "core/models/Chat"

interface MessageResponse<T> {
    count:number;
    models:T;
    page:number;
    totalCount:number
}

const baseUrl = `${process.env.REACT_APP_SERVER_URL}/Chat`

// export const sendMessageToUser = async (arg:SendMessageToUser):Promise<IResponse<any>> => {
//     const url = `${baseUrl}/send-message-to-user`
//     try{
//         const config:AxiosRequestConfig = {
//             headers:{
//                 "Accept":"application/json"
//             }
//         }
//         const response = await axios.post(url,arg,config)
//         return response.data
//     }catch(err){
//         throw err
//     }
// }

// export const sendMessageToGroup = async (arg:SendMessageToGroup):Promise<IResponse<any>> => {
//     const url = `${baseUrl}/send-message-to-group`
//     try{
//         const config:AxiosRequestConfig = {
//             headers:{
//                 "Accept":"application/json",
//                 "Content-Type":"application/json-patch+json"
//             }
//         }
//         const response = await axios.post(url,arg,config)
//         return response.data
//     }catch(err){
//         throw err
//     }
// }


export const getGroupChat = async (arg:GetGroupChat):Promise<IResponse<MessageResponse<GroupMessage[]>>> => {
    const url = `${baseUrl}/get-group-chat?groupName=${arg.groupName}&page=${arg.page}&take=${arg.take}&count=${arg.count}`
    try{
        const config:AxiosRequestConfig = {
            headers:{
                "Accept":"application/json"
            }
        }
        const response = await axios.post(url,config)
        return response.data
    }catch(err){
        throw err
    }
}