import axios from "axios"
import {IChurch} from "core/models/Church"
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