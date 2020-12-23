import {Testimony} from "core/enums/Testimony"

export interface ICommentTestimony {
    testimonyId: number;
    comment:string; 
    // {
    //   status: "Approved" | "Pending" | "Discard" | string;
    //   reason?: string;
    // };
    personId: string;
  }
  

export interface ITestimony {
    testimonyID?:number;
    testimonyTile:string;
    testimonyDetail:string;
    personId:string;
    testimonyType:Testimony;
    churchId:number;
    dateEntered:Date;
}