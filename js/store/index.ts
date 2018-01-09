import board from "../modules/Board/boardReducer";

import { createStore, applyMiddleware } from "redux";
import { combineReducers } from "redux";
import thunk from "redux-thunk";

const eggNative = combineReducers({
  board
});

const store = createStore(eggNative, applyMiddleware(thunk));

export default store;
