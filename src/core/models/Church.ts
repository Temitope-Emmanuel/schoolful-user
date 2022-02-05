import {IChurchResponse} from "./ChurchResponse"

export interface IChurch extends IChurchResponse {
    churchStatus?:string;
    email?:string;
}