// this is the egg
// it accepts a GameState and an Action
// and returns a new GameState
// totally fucking stateless and burnable in itself

import { is } from "immutable";

import { Board } from "../objects/Board";
import { BoardSize } from "../objects/BoardSize";
import { GameState } from "../objects/GameState";
import { Player } from "../objects/Player";

import { Action } from "./Action";
import * as BoardCollisions from "./BoardCollisions";
import { Collisions } from "./Collisions";
import * as Map from "./Map";
import * as Movement from "./Movement";
import { playerTypes } from "./PlayerTypes";
import { Utils } from "./Utils";

export const doAction = (
  gameState: GameState,
  action: string,
  timePassed: number
): GameState => {
  if (action === "rotateLeft") {
    return doRotate(gameState, false);
  } else if (action === "rotateRight") {
    return doRotate(gameState, true);
  } else if (action === "") {
    return doGameMove(gameState, timePassed);
  }
  return gameState;
};

// this is where we have to do a shitload of things
const doGameMove = (gameState: GameState, timePassed: number): GameState => {
  // first get rid of old outcome
  const startGameState = gameState.modify({
    outcome: ""
  });

  const newGameState = Movement.doCalcs(startGameState, timePassed);

  const action = new Action();
  const newerGameState = action.checkAllPlayerTileActions(newGameState);

  const collisions = new Collisions(playerTypes);
  const sortedPlayers = collisions.checkAllCollisions(newerGameState.players);

  const splitPlayers = BoardCollisions.checkBoardCollisions(
    newerGameState.board,
    playerTypes,
    sortedPlayers
  );

  if (newerGameState.outcome === "completeLevel") {
    if (levelIsCompleted(newGameState.board, newerGameState.players)) {
      return newerGameState.modify({
        outcome: "complete"
      })
    } else {
      return newerGameState.modify({
        outcome: ""
      })
    }
  }

  const colouredPlayers = checkNearlyFinished(
    newerGameState.modify({
      players: splitPlayers
    })
  );

  return newerGameState.modify({
    players: colouredPlayers
  });
};

const checkNearlyFinished = (gameState: GameState): Player[] => {
  if (Utils.checkLevelIsCompleted(gameState)) {
    return gameState.players.map(player => {
      if (player.value > 0) {
        const newPlayer = Utils.getPlayerByType(playerTypes, "rainbow-egg");
        return player.modify({
          ...newPlayer,
          value: player.value
        });
      }
      return player;
    });
  }
  return gameState.players;
};

// this rotates board and players
// it DOES NOT do animation - not our problem
const doRotate = (gameState: GameState, clockwise: boolean): GameState => {
  const rotations = gameState.rotations + 1;

  const boardSize = new BoardSize(gameState.board.getLength());

  const newBoard = Map.rotateBoard(gameState.board, clockwise);

  const rotatedPlayers = gameState.players.map(player => {
    return Map.rotatePlayer(boardSize, player, clockwise);
  });

  const rotateAngle: number = Map.changeRenderAngle(
    gameState.rotateAngle,
    clockwise
  );

  return gameState.modify({
    board: newBoard,
    players: rotatedPlayers,
    rotateAngle,
    rotations
  });
};

const levelIsCompleted = (board: Board, players: Player[]): boolean => {
  const collectable = countCollectable(board);
  const playerCount: number = countPlayers(players);

  if (collectable < 1 && playerCount < 2) {
    return true;
  }
  return false;
}

 // get total outstanding points left to grab on board
 const countCollectable = (board: Board): number => {
  const tiles = board.getAllTiles();
  return tiles.reduce((collectable, tile) => {
    const score = tile.get("collectable");
    if (score > 0) {
      return collectable + score;
    } else {
      return collectable;
    }
  }, 0);
}

const countPlayers = (players: Player[]): number => {
  return players.reduce((total, player) => {
    if (player && player.value > 0) {
      return total + 1;
    } else {
      return total;
    }
  }, 0);
}