export interface IPrayerRequest {
    prayerRequestID?:number;
    prayerTile:string;
    prayerTitle?:string;
    prayerDetail:string;
    personId:string;
    churchId:number;
    dateEntered:Date | string;
}