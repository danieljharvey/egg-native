import { UPDATE_GAME_STATE, UPDATE_LEVEL_DATA, UPDATE_RENDERER } from './boardActions'

import Canvas from "../../interact/Canvas"
import { GameState } from "../../objects/GameState"

import * as levelData from "../../assets/levels/1.json";

interface IBoardState {
  levelData: {}
  gameState: GameState | null
  canvas: Canvas
}

const initialState: IBoardState = {
  levelData,
  gameState: null,
  canvas: null
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
    default:
      return state
  }
}

export default board