import { IChurch } from "./Church";
// import { IDataCaptureSetting } from "./DataCaptureSetting";

export interface IState {
    stateID:number;
    name:string;
    countryID:number;
    city:ICity[];
    church:IChurch;
    country:ICountry;
    // dataCaptureSetting:IDataCaptureSetting;
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

