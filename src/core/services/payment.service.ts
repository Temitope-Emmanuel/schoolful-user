import axios, { AxiosRequestConfig } from "axios";
import { IResponse } from "core/models/Response";


const baseUrl = `${process.env.REACT_APP_SERVER_URL}/Payment`;
const config: AxiosRequestConfig = {
  headers: { "Content-Type": "application/json-patch+json" },
};


interface generateReference {
    paymentGateway:"Flutterwave" | "Paystack",
    amount:number;
    organizationType:"church" | "charity";
    organizationId:number;
    userId:string;
    donationId:number;
    societyId?:number
}


export const generateDonationReference = async ({
    amount,donationId,organizationId,organizationType,paymentGateway,societyId,userId
}:generateReference):Promise<IResponse<any>> => {
    try{
        const url = `${baseUrl}/GenerateDonationReference?paymentGatewayType=${paymentGateway}&amount=${amount}&organizationType=${organizationType}&organizationId=${organizationId}&userId=${userId}&donationId=${donationId}${societyId ? `&societyId=${societyId}` : ""} `
        const response = await axios.get(url)
        return response.data
    }catch(err){
        throw err
    }
}

export const verifyDonationTransaction = async ({
    donationId,paymentGateway,referenceCode
}:{
    referenceCode:string;
    donationId:string;
    paymentGateway:"Flutterwave" | "Paystack"
}):Promise<IResponse<any>> => {
    try{
        const url = `${baseUrl}/VerifyDonationTransactionWithReferenceId?paymentGatewayType=${paymentGateway}&referenceCode=${referenceCode}&donationId=${donationId}`
        const response = await axios.post(url)
        return response.data
    }catch(err){
        throw err
    }
}

