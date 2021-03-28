import {createStore,combineReducers,applyMiddleware} from "redux"
import {composeWithDevTools} from "redux-devtools-extension";
import logger from 'redux-logger';
import thunkMiddleware from 'redux-thunk'

import {systemReducer} from "./System/reducers"
import {activityReducer} from "./Activity/reducers"
import {chatReducer} from "./Chat/reducers"

const rootReducer = combineReducers({
    system:systemReducer,
    activity:activityReducer,
    chat:chatReducer
})


export type AppState = ReturnType<typeof rootReducer>;

export default function configureStore() {
    const middlewares = [thunkMiddleware,logger];
    const middleWareEnhancer = applyMiddleware(...middlewares);

    const store = createStore(
        rootReducer,
        composeWithDevTools(middleWareEnhancer)
    )
    return store
}