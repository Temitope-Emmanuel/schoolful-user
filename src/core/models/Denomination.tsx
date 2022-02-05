import { IChurch } from "./Church";
import { IPrayer } from "./Prayer";
export interface IDenomination {
    denominationID:number;
    denominationName:string;
    activated:boolean;
    church:IChurch;
    prayers:IPrayer[]
}
