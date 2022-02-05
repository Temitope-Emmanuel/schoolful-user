import MockAdapter from "axios-mock-adapter/types"
import churchMember from '../data/churchMember.json'

const baseUrl = new URL(`${process.env.REACT_APP_SERVER_URL}/Account`)

export const accountMock = (mock: MockAdapter) => {
    mock.onPost(`${baseUrl}/createChurchMembers`).reply(200, {
        status:200,
        isSuccessful:true,
        message:'',
        data:churchMember[0]
    })
    // Update church Member details
    mock.onPost(`${baseUrl}/updateChurchMembers`).reply(200, {
        status:200,
        isSuccessful:true,
        message:'',
        data:churchMember[0]
    })

    // Get church member detail
    const getChurchMemberUrl = `${baseUrl}/GetUserChurchInfo`;
    mock.onGet(new RegExp(`${getChurchMemberUrl}/*`)).reply(200, {
        status:200,
        isSuccessful:true,
        message:'',
        data:churchMember[0]
    })
}

// export const getUserChurchInfo = async (personId:string) => {
//     const url = `${baseUrl}/GetUserChurchInfo?personId=${personId}`
//     try{
//         const config:AxiosRequestConfig = {headers:{Accept:"text/plain"}}
//         const response = await axios.get(url,config)
//         return response.data
//     }catch(err){
//         throw err
//     }
// }
// export const createChurchMember = async (newChurchMember:IChurchMember):Promise<IResponse<IChurchMember>> => {
//     try{
//         const url = `${baseUrl}/createChurchMembers`
//         const response = await axios.post(url,newChurchMember)
//         return response.data
//     }catch(err){
//         throw err
//     }
// }
