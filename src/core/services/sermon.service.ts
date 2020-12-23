import axios,{AxiosRequestConfig} from "axios"
import {ISermon} from "core/models/Sermon"
import {IResponse} from "core/models/Response"


const baseUrl = new URL(`${process.env.REACT_APP_SERVER_URL}/Sermon`)

export const getSermonById = async (sermonId:number):Promise<IResponse<ISermon>> => {
    try{
        const base = new URL(`${baseUrl}/GetSermonById`)
        const url = new URLSearchParams(String(base)).append("id",String(sermonId))
        const response = await axios.get(String(base))
        return response.data
    }catch(err){
        throw err
    }
}

export const getChurchSermon = async (churchId:string):Promise<IResponse<ISermon[]>> => {
    const url = `${baseUrl}/GetSermonByChurch?churchId=${churchId}`
    try{
        const config:AxiosRequestConfig = {headers:{Accept:"text/plain"}}
        const response = await axios.get(url,config)
        return response.data
    }catch(err){
        throw err
    }
}
