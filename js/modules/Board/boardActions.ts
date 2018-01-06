export const UPDATE_LEVEL_DATA = "UPDATE_LEVEL_DATA";
export const UPDATE_GAME_STATE = "UPDATE_GAME_STATE";
export const UPDATE_RENDERER = "UPDATE_RENDERER";

export const ROTATE_LEFT = "ROTATE_LEFT";
export const ROTATE_RIGHT = "ROTATE_RIGHT";
export const RESET_ACTION = "RESET_ACTION";

export const updateLevelData = levelData => {
  return {
    type: UPDATE_LEVEL_DATA,
    levelData
  };
};

export const updateGameState = gameState => {
  return {
    type: UPDATE_GAME_STATE,
    gameState
  };
};

export const updateRenderer = renderer => {
  return {
    type: UPDATE_RENDERER,
    renderer
  };
};

export const rotateLeft = () => {
  return {
    type: ROTATE_LEFT
  };
};

export const rotateRight = () => {
  return {
    type: ROTATE_RIGHT
  };
};

export const resetAction = () => {
  return {
    type: RESET_ACTION
  };
};
