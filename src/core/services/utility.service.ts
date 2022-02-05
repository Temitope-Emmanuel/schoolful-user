import axios from "."
import {IResponse} from "core/models/Response"
import {ICity,ICountry,IState} from "core/models/Location"


const baseUrl = `${process.env.REACT_APP_SERVER_URL}/Utility`


export const getCountry = async ():Promise<IResponse<ICountry[]>> => {
    try{
        const url = `${baseUrl}/countries`

        const response = await axios.get(url)
        return response.data
    }catch(err){
        throw err
    }
}

export const getState = async (countryId:number):Promise<IResponse<IState[]>> => {
    try{
        const url = `${baseUrl}/state`
        const response = await axios.get(url)
        return response.data
    }catch(err){
        throw err
    }
}

export const getCity = async (stateId:number):Promise<IResponse<ICity[]>> => {
    try{
        const url = `${baseUrl}/city/${stateId}`
        const response = await axios.get(url)
        return response.data
    }catch(err){
        throw err
    }
}