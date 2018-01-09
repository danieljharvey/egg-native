export const UPDATE_LEVEL_DATA = "UPDATE_LEVEL_DATA";
export const DO_GAME_MOVE = "DO_GAME_MOVE";
export const UPDATE_RENDERER = "UPDATE_RENDERER";

export const STORE_IMAGE_DATA = "STORE_IMAGE_DATA";
export const WIPE_IMAGE_DATA = "WIPE_IMAGE_DATA";

export const START_ROTATE_LEFT = "START_ROTATE_LEFT";
export const READY_TO_TURN_LEFT = "READY_TO_TURN_LEFT";

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

export const startRotateLeft = () => {
  return {
    type: START_ROTATE_LEFT
  };
};

export const readyToTurnLeft = () => {
  return {
    type: READY_TO_TURN_LEFT
  };
};

const storeImageData = imageData => {
  return {
    type: STORE_IMAGE_DATA,
    imageData
  };
};

export const rotateLeft = () => {
  return (dispatch, getState) => {
    // announce we intend to rotate left
    dispatch(startRotateLeft());

    // now grab from canvas
    const state = getState();

    state.board.renderer.getImageData().then(imageData => {
      dispatch(storeImageData(imageData));
      // now start the turning part

      dispatch(readyToTurnLeft());
    });
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
