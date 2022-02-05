import axios,{CancelTokenSource} from "axios"
import { IResponse } from "core/models/Response"
import {LiveStreamChurchResponse} from "core/models/livestream"
import {StatusType} from "core/models/livestream"

const baseUrl = `${process.env.REACT_APP_SERVER_URL}/LiveStreaming`

export async function getBroadcastByStatus ({
    churchId,
    status,
    cancelToken
}:{
    status:StatusType,
    churchId:string;
    cancelToken?:CancelTokenSource
}):Promise<IResponse<LiveStreamChurchResponse[]>> {
    try{
        const url = `${baseUrl}/GetBroadcastByStatus/${churchId}`
        const response = await axios.get(url,{
            ...(cancelToken && {cancelToken:cancelToken.token})
        })
        return response.data
    }catch(err){
        throw err
    }
}

export async function getBroadcastByID ({
    broadcastId,churchID
}:{
    broadcastId:string;
    churchID:string
}):Promise<IResponse<LiveStreamChurchResponse>> {
    try{
        const url = `${baseUrl}/GetBroadcastById?liveBroadCastId=${broadcastId}`
        const response = await axios.post(url)
        return response.data
    }catch(err){
        throw err
    }
}