import MockAdapter from "axios-mock-adapter/types"
import activity from '../data/activity.json'
import event from '../data/event.json';

const baseUrl = process.env.REACT_APP_SERVER_URL

export const activityMock = (mock: MockAdapter) => {
    const getChurchActivityUrl = `${baseUrl}/Activity/GetChurchActivity`;
    mock.onGet(new RegExp(`${getChurchActivityUrl}/*`)).reply(200, {
        status:200,
        isSuccessful:true,
        message:'',
        data:activity
    })

    const getChurchEventUrl = `${baseUrl}/Activity/GetChurchEvent`;
    mock.onGet(new RegExp(`${getChurchEventUrl}/*`)).reply(200, {
        status:200,
        isSuccessful:true,
        message:'',
        data:event
    })
}


// export const createActivity = async (arg:IActivity):Promise<IResponse<IActivity>> => {
//     const url = `${baseUrl}/Activity/CreateActivity`
//     try{
//         const config:AxiosRequestConfig = {headers:{"Content-Type":"application/json-patch+json"}}
//         const response = await axios.post(url,arg,config)
//         return response.data
//     }catch(err){
//         throw err
//     }
// }


// export const getChurchActivity = async (churchId:string):Promise<IResponse<IActivity[]>> => {
//     const url = `${baseUrl}/Activity/GetChurchActivity/${churchId}`
//     try{
//         const config:AxiosRequestConfig = {headers:{Accept:"text/plain"}}
//         const response = await axios.get(url,config)
//         return response.data
//     }catch(err){
//         throw err
//     }
// }

// export const updateActivity = async (arg:IActivity):Promise<IResponse<null>> => {
//     const url = `${baseUrl}/Activity/UpdateActivity`
//     try{
//         const response = await axios.put(url,arg)
//         return response.data
//     }catch(err){
//         throw err
//     }
// }

// export const updateEvent = async (arg:IEvent):Promise<IResponse<IEvent>> => {
//     const url = `${baseUrl}/Activity/UpdateEvents`
//     try{
//         const config:AxiosRequestConfig = {headers:{"Content-Type":"application/json-patch+json"}}
//         const response = await axios.put(url,arg,config)
//         return response.data
//     }catch(err){
//         throw err
//     }
// }

// export const getChurchEvent = async (churchId:string):Promise<IResponse<IEvent[]>> => {
//     const url = `${baseUrl}/Activity/GetChurchEvent?churchId=${churchId}`
//     try{
//         const config:AxiosRequestConfig = {headers:{Accept:"text/plain"}}
//         const response = await axios.get(url,config)
//         return response.data
//     }catch(err){
//         throw err
//     }
// }