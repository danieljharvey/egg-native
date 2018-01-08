import { Board } from "../../objects/Board";
import { Coords } from "../../objects/Coords";
import { Player } from "../../objects/Player";
import { Tile } from "../../objects/Tile";

import * as Bootstrap from "../Bootstrap";
import { playerTypes } from "../PlayerTypes";

// create a board with 4 tiles, one of which will create a player
const createPlayerBoard = () => {
  const topLeftTile = new Tile({
    collectable: 0,
    x: 0,
    y: 0
  });

  const topRightTile = topLeftTile.modify({
    x: 1
  });

  const bottomLeftTile = topLeftTile.modify({
    y: 1
  });

  const createPlayerTile = new Tile({
    createPlayer: "egg",
    x: 1,
    y: 1
  });

  const array = [
    [topLeftTile, bottomLeftTile],
    [topRightTile, createPlayerTile]
  ];

  return new Board(array);
};

test("Create new player", () => {
  const coords = new Coords({ x: 1, y: 1 });

  const type = "egg";

  const direction = new Coords({ x: 1 });

  const player = Bootstrap.createNewPlayer(type, coords, direction);

  expect(typeof player).toEqual("object");
  expect(player.coords).toEqual(coords);
  expect(player.direction).toEqual(direction);
});

test("Filter create tiles", () => {
  const board = createPlayerBoard();

  const tiles = board.getAllTiles();

  const filtered = Bootstrap.filterCreateTiles(tiles);

  expect(filtered.size).toEqual(1);
});

test("Create multiple new players", () => {
  const board = createPlayerBoard();

  const expected = new Player({
    ...playerTypes.egg,
    coords: new Coords({ x: 1, y: 1 }),
    direction: new Coords({ x: 1 }),
    id: NaN,
    moveSpeed: 10,
    fallSpeed: 12
  });

  const players = Bootstrap.createPlayers(board);

  expect(typeof players).toEqual("object");
  expect(players.first()).toEqual(expected);
});
