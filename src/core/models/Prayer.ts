
export interface IPrayer {
    prayerID?:number;
    prayerName:string;
    prayerdetail:string;
    denominationID:number;
    denomination?:string
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
    prayerTile?:string;
    prayerTitle:string
    prayerDetail:string;
    personId:string;
    churchId:number;
    dateEntered:Date | string;
    hasPrayed?:boolean;
    timeLapsed?:string;
    prayedPrayerRequests?:IUserPrayer[]
}