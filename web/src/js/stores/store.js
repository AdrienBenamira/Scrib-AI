import {applyMiddleware, combineReducers, createStore} from "redux";
import {logger} from "redux-logger";
import {text} from "../reducers/textReducer";
import {user} from "../reducers/userReducer";
import thunk from "redux-thunk";

const reducers = combineReducers({
    user,
    text
});

const middlewares = applyMiddleware(logger, thunk);

export const store = createStore(reducers, middlewares);