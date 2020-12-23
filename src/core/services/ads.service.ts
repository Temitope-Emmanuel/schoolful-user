import axios,{AxiosRequestConfig} from "axios"
import {IAdvert} from "core/models/Advert"
import {IResponse} from "core/models/Response"


const baseUrl = `${process.env.REACT_APP_SERVER_URL}/Advert`

export const getAdvert = async (churchId:number):Promise<IResponse<IAdvert>> => {
    const url = `${baseUrl}/getAdvert?churchId=${churchId}`
    try{
        const config:AxiosRequestConfig = {headers:{
            "Accept":"text/plain"
        }}
        const response = await axios.get(url,config)
        return response.data
    }catch(err){
        throw err
    }
}

export const getAdverts = async (churchId:number):Promise<IResponse<IAdvert[]>> => {
    const url = `${baseUrl}/getAdvert?churchId=${churchId}`
    try{
        const config:AxiosRequestConfig = {headers:{
            "Accept":"text/plain"
        }}
        const response = await axios.get(url,config)
        return response.data
    }catch(err){
        throw err
    }
}
