export interface LoggedInUser {
    id: string;
    auth_token: string;
    fullname: string;
    phoneNumber: number;
    email: string;
    expirationTime: number;
    personType: number;
    picture_url:string;
    callingCode:number;
    churchId: number;
    role:string[];
    churchMemberID:string;
    personId:string;
    
}