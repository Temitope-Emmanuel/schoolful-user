export interface IPrayerRequest {
    prayerRequestID?:number;
    prayerTitle:string;
    prayerDetail:string;
    personId:string;
    churchId:number;
    dateEntered:Date | string;
}