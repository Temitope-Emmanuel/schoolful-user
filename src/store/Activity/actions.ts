import {Dispatch} from "redux"
import {IActivity, ICurrentActivity, ISchedule} from "core/models/Activity"
import {ICurrentEvent, IEvent} from "core/models/Event"
import * as activityService from "core/services/activity.service"
import history from "utils/history"
import {ToastFunc} from "utils/Toast"
import {MessageType} from "core/enums/MessageType"
import {
    ActionTypes,
    LoadActivitiesForChurchAction,
    LoadEventsForChurchAction,
    UpdateActivityAction,
    UpdateEventsAction} from "./types"
import {rrulestr} from "rrule"
import { AppState } from "store"

export function LoadActivitiesForChurch (churchId:string,toast:ToastFunc){
    return async (dispatch:Dispatch,getState:() => AppState) => {
        try{
            return await activityService.getChurchActivity(churchId).then(payload => {
                const newChurchActivity = payload.data.map((item) => {
                      const schedule = JSON.parse(item.schedule!)
                      const recurringRule = rrulestr(schedule.recurrence)
                      return ({
                        ...item,
                        schedule,
                        recurringRule,
                        recurringInfo: recurringRule.toText(),
                        isInterested:schedule.attendee.includes(getState().system.currentUser.email)
                      })
                    })
                    dispatch<LoadActivitiesForChurchAction>
                ({
                    type:ActionTypes.LOAD_ACTIVITIES_FOR_CHURCH,
                    payload:newChurchActivity
                })
            })
        }catch(err){
            toast({
                title:"Unable to Load Activities For Church",
                subtitle:`Error: ${err}`,
                messageType:MessageType.ERROR
            })
        }
    }
}

export function LoadEventsForChurch (churchId:string,toast:ToastFunc){
    return async (dispatch:Dispatch,getState:() => AppState) => {
        try{
            return await activityService.getChurchEvent(churchId).then(payload => {
                const newEventActivity = payload.data.map((item) => ({
                    ...item,
                    schedule: JSON.parse(item.schedule),
                    isInterested:JSON.parse(item.schedule).attendee.includes(getState().system.currentUser.email)
                }))
                dispatch<LoadEventsForChurchAction>
                ({
                    type:ActionTypes.LOAD_EVENT_FOR_CHURCH,
                    payload:newEventActivity
                })
            })
        }catch(err){
            toast({
                title:"Unable to Load Events For Church",
                subtitle:`Error: ${err}`,
                messageType:MessageType.ERROR
            })
        }
    }
}

export function updateActivity(updatedActivity:ICurrentActivity,toast:ToastFunc){
    return async(dispatch:Dispatch,getState:() => AppState) => {
        const { churchId, description, recuring, schedule, speaker, title, activityID, bannerUrl } = updatedActivity
        const newSchedule: ISchedule = {
            ...schedule,
            // Attach the current user email to list of attendee
          attendee: [...schedule.attendee, getState().system.currentUser.email]
        }
        // Stringify the schedule field
        const newUpdatedActivity: IActivity = {
          churchId,
          description,
          recuring,
          speaker,
          title,
          activityID,
          bannerUrl,
          schedule: JSON.stringify(newSchedule)
        }
        
        dispatch<UpdateActivityAction>({
            type:ActionTypes.UPDATE_ACTIVITY,
            payload:updatedActivity
        })
        activityService.updateActivity(newUpdatedActivity).then(payload => {
            toast({
                title:"Activity successfully update",
                subtitle:"",
                messageType:MessageType.SUCCESS
            })
            // Add it to current activity in-memory
        }).catch(err => {
            toast({
                title:"Unable to update Activity",
                subtitle:`Error:${err}`,
                messageType:MessageType.ERROR
            })
        })
    }
}
export function updateEvent(updatedEvent:ICurrentEvent,toast:ToastFunc){
    return async (dispatch:Dispatch,getState:() => AppState) => {
        const currentCalendarEvent= updatedEvent
        const attendee = [...currentCalendarEvent.schedule.attendee, getState().system.currentUser.email]
        const newUpdateEvent: IEvent = {
          ...currentCalendarEvent,
          schedule: JSON.stringify({
            attendee
          })
        }
        dispatch<UpdateEventsAction>({
            type:ActionTypes.UPDATE_EVENT,
            payload:updatedEvent
        })
        activityService.updateEvent(newUpdateEvent).then(paylaod => {
            toast({
                title:"Updated Event Successful",
                subtitle:"",
                messageType:MessageType.SUCCESS
            })
        }).catch(err => {
            toast({
                title:"Unable to update Events",
                subtitle:"",
                messageType:MessageType.ERROR
            })
        })
    }
}