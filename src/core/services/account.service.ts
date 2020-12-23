import axios,{AxiosRequestConfig} from "axios"
import {IResponse} from "core/models/Response"

const baseUrl = new URL(`${process.env.REACT_APP_SERVER_URL}/Account`)

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