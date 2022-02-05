import MockAdapter from "axios-mock-adapter/types"
import sermon from '../data/sermon.json'

const baseUrl = new URL(`${process.env.REACT_APP_SERVER_URL}/Sermon`)

export const sermonMock = (mock: MockAdapter) => {
    const getSermonUrl = `${baseUrl}/GetSermonByChurch`;
    mock.onGet(new RegExp(`${getSermonUrl}/*`)).reply(200, {
        status:200,
        isSuccessful:true,
        message:'',
        data:sermon
    })
}


// export const getSermonById = async (sermonId:number):Promise<IResponse<ISermon>> => {
//     try{
//         const base = new URL(`${baseUrl}/GetSermonById`)
//         new URLSearchParams(String(base)).append("id",String(sermonId))
//         const response = await axios.get(String(base))
//         return response.data
//     }catch(err){
//         throw err
//     }
// }

// export const getChurchSermon = async (churchId:string):Promise<IResponse<ISermon[]>> => {
//     const url = `${baseUrl}/GetSermonByChurch?churchId=${churchId}`
//     try{
//         const config:AxiosRequestConfig = {headers:{Accept:"text/plain"}}
//         const response = await axios.get(url,config)
//         return response.data
//     }catch(err){
//         throw err
//     }
// }
