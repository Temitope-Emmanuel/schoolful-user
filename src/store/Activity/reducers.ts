import { ActivityState, Action, ActionTypes } from "./types";


const defaultActivity = {
  churchId: 0,
  description: "",
  recuring: "",
  schedule: {
    time: {
      startDate: "",
      endDate: ""
    },
    recurrence: "",
    attendee: []
  },
  speaker: "",
  title: ""
}


const initialState: ActivityState = {
  activities: new Array(10).fill(defaultActivity),
  events: []
};

export function activityReducer(
  state = initialState,
  action: Action
): ActivityState {
  switch (action.type) {
    case ActionTypes.LOAD_ACTIVITIES_FOR_CHURCH:
      return {
        ...state,
        activities: action.payload,
      };
    case ActionTypes.UPDATE_ACTIVITY: {
      const filteredActivity = [...state.activities];
      const foundIdx = filteredActivity.findIndex(
        (item) => item.activityID === action.payload.activityID
      );
      filteredActivity.splice(foundIdx, 1, action.payload);
      return {
        ...state,
        activities: filteredActivity,
      };
    }
    case ActionTypes.LOAD_EVENT_FOR_CHURCH:
      return {
        ...state,
        events: action.payload,
      };
    case ActionTypes.UPDATE_EVENT: {
      const filteredEvent = [...state.events];
      const foundIdx = filteredEvent.findIndex(
        (item) => item.eventId === action.payload.eventId
      );
      filteredEvent.splice(foundIdx, 1, action.payload);
      return {
        ...state,
        events: filteredEvent,
      };
    }
    default:
      return state;
  }
}
