import MockAdapter from "axios-mock-adapter/types"
import denomination from '../data/denomination.json'
import church from '../data/church.json'

const baseUrl = `${process.env.REACT_APP_SERVER_URL}/Church`

export const churchMock = (mock: MockAdapter) => {

    mock.onGet(`${baseUrl}/getDenomination`).reply(200, {
        status:200,
        isSuccessful:true,
        message:'',
        data:denomination,
    })

    const getChurchByDenominationUrl = `${baseUrl}/getchurchbydenomination`;
    mock.onGet(new RegExp(`${getChurchByDenominationUrl}/*`)).reply(200, {
        status:200,
        isSuccessful:true,
        message:'',
        data:church,
    })

    const getChurchByIDUrl = `${baseUrl}/getchurchbyID`;
    mock.onGet(new RegExp(`${getChurchByIDUrl}/*`)).reply(200, {
        status:200,
        isSuccessful:true,
        message:'',
        data:church[0],
    })
}

// export const getChurchById = async (churchId:number) : Promise<IResponse<IChurch>> => {
//     try{
//         const url = `${baseUrl}/getchurchbyId?churchId=${churchId}`
//         const response = await axios.get(url)
//         return response.data
//     }catch(err){
//         throw err
//     }
// }
// export const getChurchDenomination = async ():Promise<IResponse<IDenomination[]>> => {
//     try{
//         const url = `${baseUrl}/getDenomination`

//         const response = await axios.get(url)
//         return response.data
//     }catch(err){
//         throw err
//     }
// }
// export const getChurchByDenomination = async (denominationId:number,stateId:number) => {
//     try{
//         // const url = `${baseUrl}/getchurchbydenomination?denominationId=${denomationId}&stateId=${stateId}`
//         const url = `${baseUrl}/getchurchbydenomination?denominationId=${denominationId}&stateId=${stateId}`
//         const response = await axios.get(url)
//         return response.data
//     }catch(err){
//         throw err
//     }
// }


// export const getStatisticalInfo = async () => {
//     try{
//         const url = `${baseUrl}/getStatisticalInfo`
//         const response = await axios.get(url)
//         return response.data
//     }catch(err){
//         throw err
//     }
// }