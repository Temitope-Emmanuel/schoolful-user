import {MediaType} from "core/enums/MediaType"

export interface ISermon {
    sermonID?:string;
    title:string;
    author:string;
    authorDesignation:string;
    featureImage?:string;
    featureDateFrom:Date;
    featureDateTo:Date;
    sermonContent:string;
    churchId:number;
    featureVidAudio?:string;
    mediaType?:MediaType;
}   
export interface IMediaSermon extends ISermon {
    next:boolean;
    previous:boolean;
    currentTime?:number;
}