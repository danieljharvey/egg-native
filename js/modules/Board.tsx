import * as React from "react";
import { StyleSheet, Text, View, Dimensions } from "react-native";
import Canvas, { Image } from "react-native-canvas";

import CanvasClass from "../interact/Canvas";
import { Renderer } from "../interact/Renderer";
import { PlayerTypes } from "../logic/PlayerTypes";
import { Board } from "../objects/Board";
import { BoardSize } from "../objects/BoardSize";
import { Tile } from "../objects/Tile";

import * as Map from "../logic/Map";

import { TileSet } from "../logic/TileSet";

import { fromJS } from "immutable";

const playerTypes = new PlayerTypes();
const players = playerTypes.getPlayerTypes();

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

const getScreenSize = () => {
  const { height, width } = Dimensions.get("window");
  return {
    screenHeight: height,
    screenWidth: width
  };
};

export default class BoardComponent extends React.Component {
  public handleCanvas = canvas => {
    const { screenHeight, screenWidth } = getScreenSize();
    const canvasClass = new CanvasClass(canvas, screenWidth, screenHeight);
    // change to props
    const size = 4;
    const boardSize = new BoardSize(size);

    const renderer = new Renderer(
      TileSet.getTiles(),
      players,
      boardSize,
      canvasClass,
      () => {
        canvasClass.wipeCanvas("#000000");
        renderer.render(board, renderMap, [], 0);
        console.log("Renderer loaded!");
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
