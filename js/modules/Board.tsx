import * as React from "react";
import { StyleSheet, Text, View, Dimensions } from "react-native";
import Canvas, { Image } from "react-native-canvas";

import CanvasClass from "../interact/Canvas";
import { Renderer } from "../interact/Renderer";
import { playerTypes } from "../logic/PlayerTypes";
import { Board } from "../objects/Board";
import { BoardSize } from "../objects/BoardSize";
import { Coords } from "../objects/Coords";
import { GameState } from "../objects/GameState";
import { Player } from "../objects/Player";
import { Tile } from "../objects/Tile";

import { RenderMap } from "../logic/RenderMap";
import { doAction } from "../logic/TheEgg";

import * as Map from "../logic/Map";

import { TileSet } from "../logic/TileSet";

import { fromJS } from "immutable";

let currentGameState = null;
let currentRenderer = null;

const board = Map.makeBoardFromArray([
  [
    new Tile({ id: 1, x: 0, y: 0 }),
    new Tile({ id: 2, x: 1, y: 0 }),
    new Tile({ id: 3, x: 2, y: 0 }),
    new Tile({ id: 4, x: 3, y: 0 }),
    new Tile({ id: 5, x: 4, y: 0 })
  ],
  [
    new Tile({ id: 1, x: 0, y: 1 }),
    new Tile({ id: 2, x: 1, y: 1 }),
    new Tile({ id: 3, x: 2, y: 1 }),
    new Tile({ id: 4, x: 3, y: 1 }),
    new Tile({ id: 5, x: 4, y: 1 })
  ],
  [
    new Tile({ id: 1, x: 0, y: 2 }),
    new Tile({ id: 2, x: 1, y: 2 }),
    new Tile({ id: 3, x: 2, y: 2 }),
    new Tile({ id: 4, x: 3, y: 2 }),
    new Tile({ id: 5, x: 4, y: 2 })
  ],
  [
    new Tile({ id: 1, x: 0, y: 3 }),
    new Tile({ id: 2, x: 1, y: 3 }),
    new Tile({ id: 3, x: 2, y: 3 }),
    new Tile({ id: 4, x: 3, y: 3 }),
    new Tile({ id: 5, x: 4, y: 3 })
  ],
  [
    new Tile({ id: 1, x: 0, y: 4 }),
    new Tile({ id: 2, x: 1, y: 4 }),
    new Tile({ id: 3, x: 2, y: 4 }),
    new Tile({ id: 4, x: 3, y: 4 }),
    new Tile({ id: 5, x: 4, y: 4 })
  ]
]);

const renderMap = [
  [true, true, true, true, true],
  [true, true, true, true, true],
  [true, true, true, true, true],
  [true, true, true, true, true],
  [true, true, true, true, true]
];

const player = new Player({
  coords: new Coords({
    x: 2,
    y: 2
  }),
  ...playerTypes.egg,
  direction: new Coords({
    x: 1
  })
});

const getScreenSize = () => {
  const { height, width } = Dimensions.get("window");
  return {
    screenHeight: height,
    screenWidth: width
  };
};

const createGameState = () => {
  return new GameState({
    players: [player],
    board
  });
};

// do next move, plop new state on pile, return new state
const getNewGameState = (
  gameState: GameState,
  action: string,
  timePassed: number
): GameState => {
  const newGameState = doAction(gameState, action, timePassed);
  // this.updateGameState(gameState, newGameState);
  currentGameState = newGameState;
  // this.playSounds(gameState, newGameState);
  return newGameState;
};

const eventLoop = (time: number, lastTime: number) => {
  const action = "";
  const timePassed = calcTimePassed(time, lastTime);
  gameCycle(timePassed, action);
  // const action = this.getNextAction();

  const anim = window.requestAnimationFrame(newTime =>
    eventLoop(newTime, time)
  );
};

const gameCycle = (timePassed: number, action: string) => {
  const gameState = currentGameState;
  const nextGameState = getNewGameState(gameState, action, timePassed);
  renderChanges(gameState, nextGameState);
};

const renderChanges = (oldGameState: GameState, newGameState: GameState) => {
  const boardSize = new BoardSize(newGameState.board.getLength());

  // if rotated everything changes anyway
  if (oldGameState.rotateAngle !== newGameState.rotateAngle) {
    return renderEverything(newGameState);
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

  const renderer = currentRenderer;
  renderer.render(
    newGameState.board,
    finalRenderMap,
    newGameState.players,
    newGameState.rotateAngle
  );
};

const renderEverything = (gameState: GameState) => {
  const boardSize = new BoardSize(gameState.board.getLength());
  const blankMap = RenderMap.createRenderMap(boardSize.width, true);
  this.renderer.render(
    gameState.board,
    blankMap,
    gameState.players,
    gameState.rotateAngle
  );
};

// create empty renderMap based on boardSize, and then apply each player's position to it
const createRenderMapFromPlayers = (
  players: Player[],
  boardSize: BoardSize
): boolean[][] => {
  const blankMap = RenderMap.createRenderMap(boardSize.width, false);
  return players.reduce((map, player) => {
    return RenderMap.addPlayerToRenderMap(player, map);
  }, blankMap);
};

const calcTimePassed = (time: number, lastTime: number): number => {
  const difference = Math.min(time - lastTime, 20);
  return difference;
};

export default class BoardComponent extends React.Component {
  public handleCanvas = canvas => {
    const { screenHeight, screenWidth } = getScreenSize();
    const canvasClass = new CanvasClass(canvas, screenWidth, screenHeight);
    // change to props
    const size = 5;
    const boardSize = new BoardSize(size);
    currentGameState = createGameState();

    const renderer = new Renderer(
      TileSet.getTiles(),
      playerTypes,
      boardSize,
      canvasClass,
      () => {
        currentRenderer = renderer;
        canvasClass.wipeCanvas("#000000");
        eventLoop(1, 0);
        // console.log("Renderer loaded!");
      }
    );
  };

  public render() {
    const { screenHeight, screenWidth } = getScreenSize();
    const size = Math.min(screenHeight, screenWidth);
    return (
      <View style={styles.container}>
        <Canvas style={{ width: size, height: size }} ref={this.handleCanvas} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center"
  },
  reactCanvas: {
    width: 320,
    height: 320
  }
});
