
export interface IPrayer {
    prayerID?:number;
    prayerName:string;
    prayerDetail:string;
}
export interface IUserPrayer {
    fullName:string;
    personPrayedId:string;
    personPrayedPictureUrl:string;
    pictureUrl:string;
    prayedPrayerRequestID:number;
    prayerRequestID:number
}
export interface IPrayerRequest {
    prayerRequestID?:number;
    fullName:string;
    pictureUrl:string;
    prayerTitle:string;
    prayerDetail:string;
    personID:string;
    churchID:number;
    createdAt:Date | string;
    hasPrayed?:boolean;
    timeLapsed?:string;
    prayedPrayerRequests?:IUserPrayer[]
}