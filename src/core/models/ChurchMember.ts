import {IGroup} from "core/models/Group"


export interface IRole {
  id:string;
  name:string;
  normalizedName:string;
  concurrencyStamp:string;
}

export interface IChurchMember {
  churchMemberID?:string;
  fcmToken?:string;
  username: string;
  password: string;
  confirmPassword?: string;
  phoneNumber: number | null;
  email: string;
  firstname: string;
  lastname: string;
  genderID: number;
  stateName: string;
  cityName?: string;
  group?: IGroup[];
  groupPosition?:string;
  picture_url?: string;
  status?:number;
  churchID?:number;
  dateOfBirth?: string | Date;
  role: 'ChurchMember'
}
