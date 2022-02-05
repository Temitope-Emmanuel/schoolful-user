import MockAdapter from "axios-mock-adapter/types"
import churchMember from '../data/churchMember.json'

const baseUrl = `${process.env.REACT_APP_SERVER_URL}/Auth`

export const userMock = (mock: MockAdapter) => {
    mock.onPost(`${baseUrl}/userLogin`).reply(200, {
        status:200,
        isSuccessful:true,
        message:'',
        data:churchMember[0]
    })
}



// export async function login(phoneNumber:number,password:string):Promise<IResponse<LoginData>>{
//     try{
//         const url = `${baseUrl}/userLogin`
//         const request:Login ={
//             username:String(phoneNumber),
//             password
//         }
//         const headers:AxiosRequestConfig = { headers: { "Access-Control-Allow-Origin": "*" } }
//         const response = await axios.post(url,request,headers);
//         return response.data;
//     }catch(err){
//         throw err
//     }
// }

// export async function verifyToken(token:string){
//     const url = `${baseUrl}/refreshToken?refreshToken=${encodeURIComponent(token)}`;
//     try{
//         const response = await axios.get(url);
//         return response.data
//     }catch(error){
//         throw error
//     }
// }
