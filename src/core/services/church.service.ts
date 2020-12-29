import axios,{AxiosRequestConfig} from "axios"
import {IChurch} from "core/models/Church"
import {IDenomination} from "core/models/Denomination"
import {IResponse} from "core/models/Response"


const baseUrl = `${process.env.REACT_APP_SERVER_URL}/Church`


export const getChurchById = async (churchId:number) : Promise<IResponse<IChurch>> => {
    try{
        const url = `${baseUrl}/getchurchbyId?churchId=${churchId}`
        const response = await axios.get(url)
        return response.data
    }catch(err){
        throw err
    }
}
export const getChurchDenomination = async ():Promise<IResponse<IDenomination[]>> => {
    try{
        const url = `${baseUrl}/getDenomination`

        const response = await axios.get(url)
        const config:AxiosRequestConfig = {headers:{Accept:"application/json"}}
        return response.data
    }catch(err){
        throw err
    }
}
export const getChurchByDenomination = async (denomationId:number,stateId:number) => {
    try{
        const url = `${baseUrl}/getchurchbydenomination?denominationId=${denomationId}&stateId=${stateId}`
        const response = await axios.get(url)
        return response.data
    }catch(err){
        throw err
    }
}

