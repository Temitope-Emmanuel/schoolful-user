import axios,{AxiosRequestConfig} from "axios"
import {IResponse} from "core/models/Response"
import {IGroup,ICreateGroupMember,IGroupMember} from "core/models/Group"

const baseUrl = `${process.env.REACT_APP_SERVER_URL}/Church`


export const getGroupByChurch = async (churchId:string):Promise<IResponse<IGroup[]>> => {
    try{
        const url = `${baseUrl}/getSocietyByChurch?churchId=${churchId}`
        const response = await axios.get(url)
        return response.data
    }catch(err){
        throw err
    }
}
export const getGroup = async (groupId:string):Promise<IResponse<IGroup[]>> => {
    try{
        const url = `${baseUrl}/createSociety`
        const response = await axios.post(url)
        return response.data
    }catch(err){
        throw err
    }
}
export const createGroupMember = async (newGroupMember:ICreateGroupMember):Promise<IResponse<IGroupMember>> => {
    try{
        const url = `${baseUrl}/createSocietyMember`
        const config:AxiosRequestConfig = {headers:{Accept:"application/json"}}
        const response = await axios.post(url,newGroupMember,config)
        return response.data
    }catch(err){
        throw err
    }
}
export const getGroupMember = async (groupId:number): Promise<IResponse<IGroupMember[]>> => {
    try{
        // /GetSocietyMember?societyId=14
        const url = `${baseUrl}/GetSocietyMember?societyId=${groupId}`
        const response = await axios.get(url)
        return response.data
    }catch(err){
        throw err
    }
}