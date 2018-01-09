import Board from "../boardReducer";

import * as BoardActions from "../boardActions";

import * as savedLevelData from "../../../assets/levels/1.json";

test("Load level data and create player", () => {
  const action = {
    type: BoardActions.UPDATE_LEVEL_DATA,
    levelData: savedLevelData
  };

  const outcome = Board(null, action);

  expect(outcome.gameState.players.length).toEqual(1);
});
