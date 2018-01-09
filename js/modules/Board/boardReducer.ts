import {
  DO_GAME_MOVE,
  ROTATE_LEFT,
  ROTATE_RIGHT,
  TOGGLE_PAUSE,
  UPDATE_LEVEL_DATA,
  UPDATE_RENDERER
} from "./boardActions";

import Canvas from "../../interact/Canvas";
import { GameState } from "../../objects/GameState";

import * as savedLevelData from "../../assets/levels/1.json";

import {
  calcTimePassed,
  createInitialGameState,
  getNewGameState
} from "../../logic/EventLoop";

interface IBoardState {
  levelData: {};
  gameState: GameState | null;
  canvas: Canvas;
  nextAction: string;
  paused: boolean;
  lastTime: number;
}

const initialState: IBoardState = {
  levelData: savedLevelData,
  gameState: null,
  canvas: null,
  nextAction: "",
  paused: false,
  lastTime: 0
};

const initialBoard = (state, levelData) => {
  return {
    ...state,
    levelData,
    gameState: createInitialGameState(levelData)
  };
};

const board = (state: IBoardState = initialState, action) => {
  switch (action.type) {
    case UPDATE_LEVEL_DATA:
      return initialBoard(state, action.levelData);
    case DO_GAME_MOVE:
      if (state.paused === true) {
        return state;
      }

      if (state.gameState && state.gameState.outcome === "complete") {
        // start over
        return initialBoard(state, state.levelData);
      }

      // quickly set up inital state here for now
      const gameState =
        state.gameState === null
          ? createInitialGameState(state.levelData)
          : state.gameState;
      const timePassed = calcTimePassed(action.newTime, state.lastTime);
      const newGameState = getNewGameState(
        gameState,
        state.nextAction,
        timePassed
      );
      return {
        ...state,
        gameState: newGameState,
        nextAction: newGameState.outcome,
        lastTime: action.newTime
      };
    case UPDATE_RENDERER:
      return {
        ...state,
        renderer: action.renderer
      };
    case ROTATE_LEFT:
      return {
        ...state,
        nextAction: "rotateLeft"
      };
    case ROTATE_RIGHT:
      return {
        ...state,
        nextAction: "rotateRight"
      };
    case TOGGLE_PAUSE:
      return {
        ...state,
        paused: !state.paused
      };
    default:
      return state;
  }
};

export default board;
