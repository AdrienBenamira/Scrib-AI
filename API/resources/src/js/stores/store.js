import {applyMiddleware, combineReducers, createStore} from "redux";
import { models } from '../reducers/modelReducer';
// import {logger} from "redux-logger";
import {text} from "../reducers/textReducer";
import {user} from "../reducers/userReducer";
import {workers} from "../reducers/workerReducer";
import thunk from "redux-thunk";
import { stats } from '../reducers/statsReducer';

const reducers = combineReducers({
    user,
    text,
    stats,
    workers,
    models
});

const middlewares = applyMiddleware(
    // logger,
    thunk
);

export const store = createStore(reducers, middlewares);