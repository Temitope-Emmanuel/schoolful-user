import {MediaType} from "core/enums/MediaType"

export interface ISermon {
    sermonID?:string;
    title:string;
    author:string;
    featureImage?:string;
    featureDateFrom:Date;
    featureDateTo:Date;
    sermonContent:string;
    churchID:number;
    mediaType: 'video' | 'audio' | 'text';
    mediaUrl?:string;
}
export interface IMediaSermon extends ISermon {
    next:boolean;
    previous:boolean;
    currentTime?:number;
}