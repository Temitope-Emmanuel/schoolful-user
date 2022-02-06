import MockAdapter from "axios-mock-adapter/types"
import group from '../data/group.json'

const baseUrl = `${process.env.REACT_APP_SERVER_URL}/Church`

export const groupMock = (mock: MockAdapter) => {
    // Get church group
    const getChurchGroupUrl = `${baseUrl}/getSocietyByChurch`;
    mock.onGet(new RegExp(`${getChurchGroupUrl}/*`)).reply(200, {
        status:200,
        isSuccessful:true,
        message:'',
        data:group
    })

}


// export const getGroupByChurch = async (churchId:string):Promise<IResponse<IGroup[]>> => {
//     try{
//         const url = `${baseUrl}/getSocietyByChurch/${churchId}`
//         const response = await axios.get(url)
//         return response.data
//     }catch(err){
//         throw err
//     }
// }
// export const getGroup = async (groupId:string):Promise<IResponse<IGroup[]>> => {
//     try{
//         const url = `${baseUrl}/createSociety`
//         const response = await axios.post(url)
//         return response.data
//     }catch(err){
//         throw err
//     }
// }
// export const createGroupMember = async (newGroupMember:ICreateGroupMember):Promise<IResponse<IGroupMember>> => {
//     try{
//         const url = `${baseUrl}/createSocietyMember`
//         const config:AxiosRequestConfig = {headers:{Accept:"application/json"}}
//         const response = await axios.post(url,newGroupMember,config)
//         return response.data
//     }catch(err){
//         throw err
//     }
// }
// export const getGroupMember = async (groupId:number): Promise<IResponse<IGroupMember[]>> => {
//     try{
//         // /GetSocietyMember?societyId=14
//         const url = `${baseUrl}/GetSocietyMember?societyId=${groupId}`
//         const response = await axios.get(url)
//         return response.data
//     }catch(err){
//         throw err
//     }
// }
