import {ICurrentActivity} from "core/models/Activity"
import {ICurrentEvent} from "core/models/Event"

export interface ActivityState {
    activities:ICurrentActivity[];
    events:ICurrentEvent[]
}

export enum ActionTypes {
    LOAD_ACTIVITIES_FOR_CHURCH = "[ACTIVITY] LOAD_ACTIVITIES_FOR_CHURCH",
    LOAD_EVENT_FOR_CHURCH = "[EVENT] LOAD_EVENT_FOR_CHURCH",
    UPDATE_ACTIVITY = "[ACTIVITY] UPDATE_ACTIVITY",
    UPDATE_EVENT = "[EVENT] UPDATE_EVENT"
}

//#region Action creator for Activity
export interface LoadActivitiesForChurchAction {
    type:ActionTypes.LOAD_ACTIVITIES_FOR_CHURCH,
    payload:ICurrentActivity[]
}
export interface UpdateActivityAction {
    type:ActionTypes.UPDATE_ACTIVITY,
    payload:ICurrentActivity
}
//#endregion

//#region Action creator for event
export interface LoadEventsForChurchAction {
    type:ActionTypes.LOAD_EVENT_FOR_CHURCH,
    payload:ICurrentEvent[]
}
export interface UpdateEventsAction {
    type:ActionTypes.UPDATE_EVENT,
    payload:ICurrentEvent
}
//#endregion

export type Action = LoadActivitiesForChurchAction | LoadEventsForChurchAction | LoadActivitiesForChurchAction | UpdateEventsAction | UpdateActivityAction