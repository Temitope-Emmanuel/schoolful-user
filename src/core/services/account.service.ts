import axios,{AxiosRequestConfig} from "axios"
import {IResponse} from "core/models/Response"
import {IChurchMember} from "core/models/ChurchMember"

const baseUrl = new URL(`${process.env.REACT_APP_SERVER_URL}/Account`)

const config:AxiosRequestConfig = {headers:{"Content-Type":"application/json-patch+json"}}

export const getUserChurchInfo = async (personId:string) => {
    const url = `${baseUrl}/GetUserChurchInfo?personId=${personId}`
    try{
        const config:AxiosRequestConfig = {headers:{Accept:"text/plain"}}
        const response = await axios.get(url,config)
        return response.data
    }catch(err){
        throw err
    }
}
export const createChurchMember = async (newChurchMember:IChurchMember):Promise<IResponse<IChurchMember>> => {
    try{
        const url = `${baseUrl}/createChurchMembers`
        const response = await axios.post(url,newChurchMember)
        return response.data
    }catch(err){
        throw err
    }
}
