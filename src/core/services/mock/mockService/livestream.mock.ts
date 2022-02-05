import MockAdapter from "axios-mock-adapter/types"
import livestream from '../data/liveBroadcast.json'

const baseUrl = `${process.env.REACT_APP_SERVER_URL}/LiveStreaming`

export const livestreamMock = (mock: MockAdapter) => {
    const getBroadcastUrl = `${baseUrl}/GetBroadcastByStatus`
    mock.onGet(new RegExp(`${getBroadcastUrl}/*`)).reply(200, {
        status:200,
        isSuccessful:true,
        message:'',
        data:livestream
    })
}



// export async function getBroadcastByStatus ({
//     churchId,
//     status,
//     cancelToken
// }:{
//     status:StatusType,
//     churchId:string;
//     cancelToken?:CancelTokenSource
// }):Promise<IResponse<LiveStreamChurchResponse[]>> {
//     try{
//         const url = `${baseUrl}/GetBroadcastByStatus?churchId=${churchId}&status=${status}`
//         const response = await axios.get(url,{
//             ...(cancelToken && {cancelToken:cancelToken.token})
//         })
//         return response.data
//     }catch(err){
//         throw err
//     }
// }

// export async function getBroadcastByID ({
//     broadcastId,churchID
// }:{
//     broadcastId:string;
//     churchID:string
// }):Promise<IResponse<LiveStreamChurchResponse>> {
//     try{
//         const url = `${baseUrl}/GetBroadcastById?liveBroadCastId=${broadcastId}`
//         const response = await axios.post(url)
//         return response.data
//     }catch(err){
//         throw err
//     }
// }