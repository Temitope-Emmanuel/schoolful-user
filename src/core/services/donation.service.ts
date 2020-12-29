import axios,{AxiosRequestConfig} from "axios"
import {IDonation} from "core/models/Donation"
import {IResponse} from "core/models/Response"


const baseUrl = `${process.env.REACT_APP_SERVER_URL}/Donation`


export const AddDonation = async(newDonation:IDonation):Promise<IResponse<IDonation>> => {
    try{
        const url = `${baseUrl}/AddDonation`
        const config:AxiosRequestConfig = {headers:{"Content-Type":"application/json-patch+json"}}
        const response = await axios.post(url,newDonation,config)
        return response.data
    }catch(err){
        throw err
    }
}

export const GetDonationByChurch = async (churchId:number):Promise<IResponse<IDonation[]>> => {
    try{
        const url = `${baseUrl}/GetDonationByChurch?churchId=${churchId}`
        const response = await axios.get(url)
        return response.data
    }catch(err){
        throw err
    }
}