import { UPDATE_GAME_STATE, UPDATE_LEVEL_DATA, UPDATE_RENDERER, ROTATE_LEFT, ROTATE_RIGHT, RESET_ACTION } from './boardActions'

import Canvas from "../../interact/Canvas"
import { GameState } from "../../objects/GameState"

import * as levelData from "../../assets/levels/1.json";

interface IBoardState {
  levelData: {}
  gameState: GameState | null
  canvas: Canvas,
  nextAction: string,
  paused: boolean
}

const initialState: IBoardState = {
  levelData,
  gameState: null,
  canvas: null,
  nextAction: "",
  paused: false
}

const board = (state: IBoardState = initialState, action) => {
  switch (action.type) {
    case UPDATE_LEVEL_DATA:
      return {
        ...state,
        levelData: action.levelData
      }
    case UPDATE_GAME_STATE:
      return {
        ...state,
        gameState: action.gameState
      }
    case UPDATE_RENDERER:
      return {
        ...state,
        renderer: action.renderer
      }
    case ROTATE_LEFT:
      return {
        ...state,
        nextAction: ROTATE_LEFT
      }
    case ROTATE_RIGHT:
      return {
        ...state,
        nextAction: ROTATE_RIGHT
      }
    case RESET_ACTION:
      return {
        ...state,
        nextAction: ""
      }
    default:
      return state
  }
}

export default board