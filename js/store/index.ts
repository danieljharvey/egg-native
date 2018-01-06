import board from "../modules/Board/boardReducer"

import { combineReducers } from 'redux'

const eggNative = combineReducers({
  board
})

export default eggNative