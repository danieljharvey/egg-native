import {
  DO_GAME_MOVE,
  READY_TO_TURN_LEFT,
  ROTATE_RIGHT,
  START_ROTATE_LEFT,
  TOGGLE_PAUSE,
  UPDATE_LEVEL_DATA,
  UPDATE_RENDERER,
  STORE_IMAGE_DATA
} from "./boardActions";

import { Renderer } from "../../interact/Renderer";
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
  renderer: Renderer;
  nextAction: string;
  paused: boolean;
  lastTime: number;
  imageData: HTMLImageElement;
  drawAngle: number;
}

export const initialState: IBoardState = {
  levelData: savedLevelData,
  gameState: null,
  renderer: null,
  nextAction: "",
  paused: false,
  lastTime: 0,
  imageData: null,
  drawAngle: 0
};

const initialBoard = (state: IBoardState, levelData) => {
  return {
    ...state,
    levelData,
    gameState: createInitialGameState(levelData)
  };
};

const startTurningLeft = (state: IBoardState) => {
  return {
    ...state,
    nextAction: "turningLeft"
  };
};

// todo - use action.newTime to temper the speed here like other moves
const turnLeft = (state: IBoardState, action) => {
  const moveSpeed = 10;

  const drawAngle = (state.drawAngle += -1 * (moveSpeed / 2));

  if (drawAngle < -90) {
    // done
    return {
      ...state,
      drawAngle: 0,
      nextAction: ""
    };
  }
  return {
    ...state,
    drawAngle
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

      if (state.nextAction === "rotateLeft") {
        return state;
      }

      if (state.nextAction === "turnLeft") {
        return turnLeft(state, action);
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
    case STORE_IMAGE_DATA:
      return {
        ...state,
        imageData: action.imageData
      };
    case START_ROTATE_LEFT:
      return {
        ...state,
        nextAction: "rotateLeft",
        imageData: null,
        drawAngle: 0
      };

    case READY_TO_TURN_LEFT:
      return {
        ...state,
        nextAction: "turnLeft"
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
