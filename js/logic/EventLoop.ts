import { Dimensions } from "react-native";
import { Board } from "../objects/Board";
import { BoardSize } from "../objects/BoardSize";
import { Coords } from "../objects/Coords";
import { GameState } from "../objects/GameState";
import { Player } from "../objects/Player";
import { Tile } from "../objects/Tile";

import CanvasClass from "../interact/Canvas";
import * as Map from "../logic/Map";
import { playerTypes } from "../logic/PlayerTypes";

import { Renderer } from "../interact/Renderer";

import { RenderMap } from "./RenderMap";
import { SavedLevel } from "./SavedLevel";
import { doAction } from "./TheEgg";
import { TileSet } from "./TileSet";

export const handleCanvas = (canvas, levelData, callback) => {
  const { screenHeight, screenWidth } = getScreenSize();
  const canvasClass = new CanvasClass(canvas, screenWidth, screenHeight);
  // change to props

  const gameState = createInitialGameState(levelData);
  const size = gameState.board.getLength();
  const boardSize = new BoardSize(size);

  const renderer = new Renderer(
    TileSet.getTiles(),
    playerTypes,
    boardSize,
    canvasClass,
    () => {
      canvasClass.wipeCanvas("#000000");
      renderEverything(renderer, gameState);
      callback(renderer);
      // console.log("Renderer loaded!");
    }
  );
};

const getBoardFromData = (data): Board => {
  const levelID = data.levelID;
  const boardSize = new BoardSize(data.boardSize.width);
  const savedLevel = new SavedLevel(boardSize, data.board, levelID);
  return Map.makeBoardFromArray(savedLevel.board);
};

const player = new Player({
  coords: new Coords({
    x: 3,
    y: 3
  }),
  ...playerTypes.egg,
  moveSpeed: 10,
  fallSpeed: 15,
  direction: new Coords({
    x: 1
  })
});

export const getScreenSize = () => {
  const { height, width } = Dimensions.get("window");
  return {
    screenHeight: height,
    screenWidth: width
  };
};

export const createInitialGameState = levelData => {
  return new GameState({
    players: [player],
    board: getBoardFromData(levelData)
  });
};

export const renderChanges = (
  renderer: Renderer,
  oldGameState: GameState,
  newGameState: GameState
) => {
  const boardSize = new BoardSize(newGameState.board.getLength());

  // if rotated everything changes anyway
  if (oldGameState.rotateAngle !== newGameState.rotateAngle) {
    return renderEverything(renderer, newGameState);
  }

  // player map is covering old shit up
  const playerRenderMap = createRenderMapFromPlayers(
    oldGameState.players,
    boardSize
  );

  // render changes
  const boardRenderMap = RenderMap.createRenderMapFromBoards(
    oldGameState.board,
    newGameState.board
  );

  const finalRenderMap = RenderMap.combineRenderMaps(
    playerRenderMap,
    boardRenderMap
  );

  renderer.render(
    newGameState.board,
    finalRenderMap,
    newGameState.players,
    newGameState.rotateAngle
  );
};

const renderEverything = (renderer, gameState: GameState) => {
  const boardSize = new BoardSize(gameState.board.getLength());
  const blankMap = RenderMap.createRenderMap(boardSize.width, true);
  renderer.render(
    gameState.board,
    blankMap,
    gameState.players,
    gameState.rotateAngle
  );
};

export const renderRotation = (
  renderer: Renderer,
  imageData,
  drawAngle: number
) => {
  renderer.drawRotatedImage(imageData, drawAngle);
};

// create empty renderMap based on boardSize, and then apply each player's position to it
const createRenderMapFromPlayers = (
  players: Player[],
  boardSize: BoardSize
): boolean[][] => {
  const blankMap = RenderMap.createRenderMap(boardSize.width, false);
  return players.reduce((map, thisPlayer: Player) => {
    return RenderMap.addPlayerToRenderMap(thisPlayer, map);
  }, blankMap);
};

export const calcTimePassed = (time: number, lastTime: number): number => {
  const difference = Math.min(time - lastTime, 20);
  return difference;
};
