import { fromJS, List } from "immutable";
import { Coords } from "../objects/Coords";
import { Player } from "../objects/Player";

import { playerTypes } from "../logic/PlayerTypes";

import { Utils } from "./Utils";

import * as _ from "ramda";

export const checkAllCollisions = (players: Player[]): Player[] => {
  const combinations = getAllPlayerCombinations(players);

  // only one egg, do nothing
  if (combinations.length === 0) {
    return players;
  }

  const collided = findCollisions(combinations, players);

  if (collided.length === 0) {
    return players;
  }

  const oldPlayers = removeCollidedPlayers(collided, players);

  const newPlayers = createNewPlayers(collided, players);

  const allPlayers = combinePlayerLists(oldPlayers, newPlayers);

  return allPlayers;
};

export const combinePlayerLists = (
  oldPlayers: Player[],
  newPlayers: Player[]
): Player[] => {
  const allPlayers = [];
  oldPlayers.map(player => {
    allPlayers.push(player);
  });
  newPlayers.map(player => {
    allPlayers.push(player);
  });
  return fromJS(allPlayers);
};

// send an array of pairs of player ids, returns all that collide
export const findCollisions = (
  combinations: number[][],
  players: Player[]
): number[][] => {
  return combinations.filter(comb => {
    const player1 = fetchPlayerByID(players, comb[0]);
    const player2 = fetchPlayerByID(players, comb[1]);
    return checkCollision(player1, player2);
  });
};

// returns all non-collided players
// collided is any number of pairs of IDs, ie [[1,3], [3,5]]
export const removeCollidedPlayers = (
  collided: number[][],
  players: Player[]
): Player[] => {
  const collidedIDs = Utils.flattenArray(collided);
  const uniqueIDs = Utils.removeDuplicates(collidedIDs);

  return players.filter(player => {
    if (uniqueIDs.indexOf(player.id) === -1) {
      return true;
    }
    return false;
  });
};

// go through each collided pair and combine the players to create new ones
export const createNewPlayers = (collided, players: Player[]): Player[] => {
  return collided.reduce((newPlayers, collidedIDs) => {
    const player1 = fetchPlayerByID(players, collidedIDs[0]);
    const player2 = fetchPlayerByID(players, collidedIDs[1]);
    if (player1 === null || player2 === null) {
      return newPlayers;
    }
    const newOnes = combinePlayers(player1, player2);
    return newPlayers.concat(newOnes);
  }, []);
};

export const fetchPlayerByID = (players: Player[], id: number): Player => {
  const matching = players.filter(player => {
    return player.id === id;
  });

  if (matching.length === 0) {
    return null;
  }

  // we've found one then

  return _.find(item => {
    return item !== undefined;
  }, matching);
};

export const getAllPlayerCombinations = (players: Player[]): number[][] => {
  return players.reduce((total, player) => {
    const otherPlayers = players.filter(otherPlayer => {
      return player.id < otherPlayer.id;
    });
    const combos = otherPlayers.map(otherPlayer => {
      return [player.id, otherPlayer.id];
    });
    return total.concat(cleanCombos(combos));
  }, []);
};

// un-immutables values for sanity's sake
export const cleanCombos = (combo: any): number[] => {
  if (List.isList(combo)) {
    return combo.toJS();
  }
  return combo;
};

export const getAllPlayerIDs = (players: Player[]) => {
  return players.map(player => {
    return player.id;
  });
};

// only deal with horizontal collisions for now
export const checkCollision = (player1: Player, player2: Player) => {
  if (!player1 || !player2) {
    return false;
  }

  if (player1.id === player2.id) {
    return false;
  }

  if (player1.value === 0 || player2.value === 0) {
    return false;
  }

  if (player1.lastAction === "split" || player2.lastAction === "split") {
    return false;
  }

  const coords1 = player1.coords;
  const coords2 = player2.coords;

  if (coords1.y !== coords2.y) {
    return false;
  }

  let distance =
    coords1.getActualPosition().fullX - coords2.getActualPosition().fullX;
  if (distance < 0) {
    distance = distance * -1;
  }

  if (distance <= 20) {
    return true;
  }

  // nothing changes
  return false;
};

export const chooseHigherLevelPlayer = (player1: Player, player2: Player) => {
  if (player1.value > player2.value) {
    return player1;
  }
  if (player2.value > player1.value) {
    return player2;
  }
  if (player1.value === player2.value) {
    return player1;
  }
};

export const combinePlayers = (player1: Player, player2: Player): Player[] => {
  const newValue = player1.value + player2.value;
  const higherPlayer = chooseHigherLevelPlayer(player1, player2);

  const newPlayerType = Utils.getPlayerByValue(playerTypes, newValue);

  if (!newPlayerType) {
    return [player1, player2];
  }

  const newPlayerParams = (Object as any).assign({}, newPlayerType, {
    coords: higherPlayer.coords,
    direction: higherPlayer.direction
  });

  return [player1.modify(newPlayerParams)];
};
