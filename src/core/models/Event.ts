import {IBaseModel} from "./BaseEventModel"

export interface EventSchedule {
    attendee:string[]
}

type ScheduleType = string | EventSchedule

export interface IEvent<T extends ScheduleType = string> extends IBaseModel {
    eventId?:number;
    // schedule:string | EventSchedule;
    schedule:T;
    startDateTime:Date | string;
    endDateTime:Date | string;
}
export interface ICurrentEvent extends IEvent<EventSchedule> {
    isInterested:boolean
  }
  