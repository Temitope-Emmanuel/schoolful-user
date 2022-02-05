import axios,{AxiosRequestConfig,CancelTokenSource} from "axios"
import {IResponse} from "core/models/Response"
import {IAnnouncement} from "core/models/Announcement"

const baseUrl = `${process.env.REACT_APP_SERVER_URL}/Infomation`

export const getAnnouncementByChurch = async (churchId:string,cancelToken:CancelTokenSource):Promise<IResponse<IAnnouncement[]>> => {
    const url = `${baseUrl}/GetAnnouncementByChurch/${churchId}`
    try{
        const config:AxiosRequestConfig = {headers:{
            "Accept":"text/plain"
        },
        cancelToken:cancelToken.token
    }
        const response = await axios.get(url,config)
        return response.data
    }catch(err){
        throw err
    }
}