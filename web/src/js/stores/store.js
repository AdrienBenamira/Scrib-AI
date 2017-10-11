import {applyMiddleware, combineReducers, createStore} from "redux";
import {logger} from "redux-logger";
import {text} from "../reducers/textReducer";
import {user} from "../reducers/userReducer";
import thunk from "redux-thunk";
import { stats } from '../reducers/statsReducer';

const reducers = combineReducers({
    user,
    text,
    stats
});

const middlewares = applyMiddleware(logger, thunk);

export const store = createStore(reducers, middlewares);