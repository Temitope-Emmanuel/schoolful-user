import {Testimony} from "core/enums/Testimony"

export interface ITestimony {
    testimonyID?:number;
    testimonyTile:string;
    testimonyDetail:string;
    personId:string;
    testimonyType:Testimony;
    churchId:number;
    dateEntered:Date;
}