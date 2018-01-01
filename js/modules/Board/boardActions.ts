export const UPDATE_LEVEL_DATA = "UPDATE_LEVEL_DATA";
export const UPDATE_GAME_STATE = "UPDATE_GAME_STATE";
export const UPDATE_RENDERER = "UPDATE_RENDERER";

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
