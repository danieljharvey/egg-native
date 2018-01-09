import Board, { initialState } from "../boardReducer";

import * as BoardActions from "../boardActions";

import * as savedLevelData from "../../../assets/levels/1.json";

const loadedState = Board(
  initialState,
  BoardActions.updateLevelData(savedLevelData)
);

test("Load level data and create player", () => {
  expect(loadedState.gameState.players.length).toEqual(1);
});

test("Do nothing when paused", () => {
  const state = {
    ...loadedState,
    paused: true
  };

  const newTime = 100;

  const outcome = Board(state, BoardActions.doGameMove(newTime));

  expect(outcome).toEqual(state);
});

test("Player moves in a normal game move", () => {
  const oldFirstPlayer = loadedState.gameState.players[0];

  const newTime = 100;

  const outcome = Board(loadedState, BoardActions.doGameMove(newTime));

  const newFirstPlayer = outcome.gameState.players[0];

  expect(oldFirstPlayer.equals(newFirstPlayer)).toEqual(false);
});

test("Rotate left starts the big turning party but does nothing more", () => {
  const rotatedLeft = Board(loadedState, BoardActions.startRotateLeft());

  expect(rotatedLeft.nextAction).toEqual("rotateLeft");
  expect(rotatedLeft.imageData).toEqual(null);

  const newTime = 100;

  const nextMove = Board(rotatedLeft, BoardActions.doGameMove(100));

  expect(nextMove.nextAction).toEqual("rotateLeft");
});

test("Turn left starts the big turning party but does nothing more", () => {
  const rotatedLeft = Board(loadedState, BoardActions.startRotateLeft());

  const savedData = Board(rotatedLeft, {
    type: BoardActions.STORE_IMAGE_DATA,
    imageData: { plop: "plop" }
  });

  expect(savedData.nextAction).toEqual("rotateLeft");

  const readyToTurn = Board(savedData, BoardActions.readyToTurnLeft());

  expect(readyToTurn.nextAction).toEqual("turnLeft");
  expect(readyToTurn.drawAngle).toEqual(0);

  const newTime = 100;

  const nextMove = Board(readyToTurn, BoardActions.doGameMove(100));

  expect(nextMove.nextAction).toEqual("turnLeft");
  expect(nextMove.drawAngle < 0).toEqual(true);
});

test("Stops rotating at some point", () => {
  const nearlyDone = {
    ...loadedState,
    drawAngle: -89.9,
    nextAction: "turnLeft"
  };

  const turnAgain = Board(nearlyDone, BoardActions.doGameMove(100));

  expect(turnAgain.nextAction).toEqual("");
  expect(turnAgain.drawAngle).toEqual(0);
});
