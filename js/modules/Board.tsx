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
  const anim = window.requestAnimationFrame(newTime =>
    eventLoop(newTime, time)
  );

  const timePassed = calcTimePassed(time, lastTime);

  // const action = this.getNextAction();
  const action = "";

  gameCycle(timePassed, action);
};

const gameCycle = (timePassed: number, action: string) => {
  const gameState = currentGameState;
  const nextGameState = getNewGameState(gameState, action, timePassed);
  const renderer = currentRenderer;
  renderer.render(nextGameState.board, renderMap, nextGameState.players, 0);
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
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  },
  reactCanvas: {
    width: 320,
    height: 320
  }
});
