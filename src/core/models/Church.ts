import {IChurchResponse} from "./ChurchResponse"

export interface IChurch extends IChurchResponse {
    churchStatus?:string;
    email?:string;
    country?:string;
    // 
    // denominationName?:string;
    countryName?:string
}

interface ISubscription {
    subscriptionPlanID:number;
    name:string;
    category:string;
    features:string;
    cost:string;
    createdAt:string;
    updatedAt:string;
    createdBy:string;
    updatedBy:string;
    status:number;
    lifetimeDuration:number;
}

interface IPaymentResponse {
    status:string;
    amount:number;
    reference:string;
    message:string;
    publicKey:string;
    customerName:string;
    invoiceCode:string;
}
 