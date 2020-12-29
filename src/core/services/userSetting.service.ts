import axios,{AxiosRequestConfig} from "axios"
import {IResponse} from "core/models/Response"

const baseUrl = new URL(`${process.env.REACT_APP_SERVER_URL}/UserSetting`)


interface IUpdateChurchMember {
    churchMemberID:string;
    personId:string;
    zoneId:number;
    organId:number;
    churchId:number;
    isPrimaryChurch:boolean;
    organPositionId:number;
    zonalPositionId:number
}

export const updateChurchMember = async (arg:IUpdateChurchMember):Promise<IResponse<IUpdateChurchMember>> => {
    const url = `${baseUrl}/updateChurchMembers`
    try{
        const config:AxiosRequestConfig = {headers:{"Content-Type":"application/json-patch+json"}}
        const response = await axios.post(url,arg,config)
        return response.data
    }catch(err){
        throw err
    }
}