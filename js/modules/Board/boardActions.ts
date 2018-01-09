export const UPDATE_LEVEL_DATA = "UPDATE_LEVEL_DATA";
export const DO_GAME_MOVE = "DO_GAME_MOVE";
export const UPDATE_RENDERER = "UPDATE_RENDERER";

export const ROTATE_LEFT = "ROTATE_LEFT";
export const ROTATE_RIGHT = "ROTATE_RIGHT";

export const TOGGLE_PAUSE = "TOGGLE_PAUSE";

export const updateLevelData = levelData => {
  return {
    type: UPDATE_LEVEL_DATA,
    levelData
  };
};

export const doGameMove = (newTime: number) => {
  return {
    type: DO_GAME_MOVE,
    newTime
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

export const togglePause = () => {
  return {
    type: TOGGLE_PAUSE
  };
};
