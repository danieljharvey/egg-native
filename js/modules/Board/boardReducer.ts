import { DO_GAME_MOVE, UPDATE_LEVEL_DATA, UPDATE_RENDERER, ROTATE_LEFT, ROTATE_RIGHT, RESET_ACTION } from './boardActions'

import Canvas from "../../interact/Canvas"
import { GameState } from "../../objects/GameState"

import * as levelData from "../../assets/levels/1.json";

import { createInitialGameState, getNewGameState } from "../../logic/EventLoop"

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
        levelData: action.levelData,
        gameState: createInitialGameState(action.levelData)
      }
    case DO_GAME_MOVE:
      if (state.paused === true) {
        return state
      }
      // quickly set up inital state here for now
      const gameState = (state.gameState === null) ? createInitialGameState(state.levelData) : state.gameState
      const timePassed =20  
      const newGameState = getNewGameState(gameState, state.nextAction, timePassed)
      return {
        ...state,
        gameState: newGameState,
        nextAction: newGameState.outcome
      }
    case UPDATE_RENDERER:
      return {
        ...state,
        renderer: action.renderer
      }
    case ROTATE_LEFT:
      return {
        ...state,
        nextAction: "rotateLeft"
      }
    case ROTATE_RIGHT:
      return {
        ...state,
        nextAction: "rotateRight"
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