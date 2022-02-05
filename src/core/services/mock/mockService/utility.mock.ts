import MockAdapter from "axios-mock-adapter/types"
import states from '../data/states.json'

const baseUrl = `${process.env.REACT_APP_SERVER_URL}/Utility`

export const utilityMock = (mock: MockAdapter) => {

    mock.onGet(`${baseUrl}/state`).reply(200, {
        status:200,
        isSuccessful:true,
        message:'',
        data:states,
    })
}


// export const getCountry = async ():Promise<IResponse<ICountry[]>> => {
//     try{
//         const url = `${baseUrl}/countries`

//         const response = await axios.get(url)
//         return response.data
//     }catch(err){
//         throw err
//     }
// }

// export const getState = async (countryId:number):Promise<IResponse<IState[]>> => {
//     try{
//         const url = `${baseUrl}/state/${countryId}`
//         const response = await axios.get(url)
//         return response.data
//     }catch(err){
//         throw err
//     }
// }

// export const getCity = async (stateId:number):Promise<IResponse<ICity[]>> => {
//     try{
//         const url = `${baseUrl}/city/${stateId}`
//         const response = await axios.get(url)
//         return response.data
//     }catch(err){
//         throw err
//     }
// }