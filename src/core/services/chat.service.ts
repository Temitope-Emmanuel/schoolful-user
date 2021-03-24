import axios,{AxiosRequestConfig,CancelTokenSource} from "axios"
import {IResponse} from "core/models/Response"
import {SendMessageToGroup,SendMessageToUser} from "core/models/Chat"

const baseUrl = `${process.env.REACT_APP_SERVER_URL}/Chat`

export const sendMessageToUser = async (arg:SendMessageToUser):Promise<IResponse<any>> => {
    const url = `${baseUrl}/send-message-to-user`
    try{
        const config:AxiosRequestConfig = {
            headers:{
                "Accept":"application/json"
            }
        }
        const response = await axios.post(url,arg,config)
        return response.data
    }catch(err){
        throw err
    }
}

export const sendMessageToGroup = async (arg:SendMessageToGroup):Promise<IResponse<any>> => {
    const url = `${baseUrl}/send-message-to-group`
    try{
        const config:AxiosRequestConfig = {
            headers:{
                "Accept":"application/json"
            }
        }
        const response = await axios.post(url,arg,config)
        return response.data
    }catch(err){
        throw err
    }
}


export const getGroupChat = async (groupName:string):Promise<IResponse<any>> => {
    const url = `${baseUrl}/get-group-chat`
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