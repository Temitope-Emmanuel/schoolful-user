import { IChurch } from "./Church";

export interface IState {
    state:string;
    city:ICity[];
    church:IChurch;
    country:string;
    name: string;
    capital: string;
}
export interface ICity {
    cityID:number;
    name:string;
    stateID:number;
    churchs:IChurch[];
    state:IState
}

export interface ICountry {
    countryID:number;
    sortname:string;
    name:string;
    phoneCode:number;
    churchs:IChurch[];
    states:IState[]
}

