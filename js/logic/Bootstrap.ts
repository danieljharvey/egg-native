import { Dimensions } from "react-native";
import { Board } from "../objects/Board";
import { BoardSize } from "../objects/BoardSize";
import { Coords } from "../objects/Coords";
import { GameState } from "../objects/GameState";
import { Player } from "../objects/Player";
import { Tile } from "../objects/Tile";

import { playerTypes } from "../logic/PlayerTypes";

const moveSpeed = 10;

// create player
export const createNewPlayer = (
  type: string,
  coords: Coords,
  direction: Coords
): Player => {
  const playerType = playerTypes[type];
  const params = JSON.parse(JSON.stringify(playerType));
  params.id = this.nextPlayerID++;
  params.coords = coords;
  params.direction = direction;
  if (!Object.hasOwnProperty.call(params, "moveSpeed")) {
    params.moveSpeed = moveSpeed;
    params.fallSpeed = moveSpeed * 1.2;
  }
  return new Player(params);
};

// cycle through all map tiles, find egg cups etc and create players
export const createPlayers = (board: Board) => {
  const tiles = board.getAllTiles();

  const filtered = filterCreateTiles(tiles);

  const players = filtered.map((tile: Tile) => {
    const type = tile.createPlayer;
    const coords = new Coords({
      offsetX: 0,
      offsetY: 0,
      x: tile.x,
      y: tile.y
    });
    const direction = new Coords({ x: 1 });
    return this.createNewPlayer(type, coords, direction);
  });
  return players;
};

export const filterCreateTiles = tiles => {
  return tiles.filter(tile => {
    return tile.createPlayer !== "";
  });
};
