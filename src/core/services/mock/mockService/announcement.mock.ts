import MockAdapter from "axios-mock-adapter/types"
import announcement from '../data/announcement.json'

const baseUrl = `${process.env.REACT_APP_SERVER_URL}/Infomation`

export const announcementMock = (mock: MockAdapter) => {

    const getAnnouncementUrl = `${baseUrl}/GetAnnouncementByChurch`;
    mock.onGet(new RegExp(`${getAnnouncementUrl}/*`)).reply(200, {    status:200,
        isSuccessful:true,
        message:'',
        data:announcement
    })
}


// export const getAnnouncementByChurch = async (churchId:string,cancelToken:CancelTokenSource):Promise<IResponse<IAnnouncement[]>> => {
//     const url = `${baseUrl}/GetAnnouncementByChurch/${churchId}`
//     try{
//         const config:AxiosRequestConfig = {headers:{
//             "Accept":"text/plain"
//         },
//         cancelToken:cancelToken.token
//     }
//         const response = await axios.get(url,config)
//         return response.data
//     }catch(err){
//         throw err
//     }
// }