import * as React from "react";
import { StyleSheet, Text, View } from "react-native";
import Canvas, { Image } from "react-native-canvas";

import CanvasClass from "../interact/Canvas";
import { Renderer } from "../interact/Renderer";
import { PlayerTypes } from "../logic/PlayerTypes";
import { BoardSize } from "../objects/BoardSize";

import { TileSet } from "../logic/TileSet";

const playerTypes = new PlayerTypes();
const players = playerTypes.getPlayerTypes();

const SPRITE_SIZE = 64;

const drawImage = (ctx, img) => {
  // console.log("drawImage", ctx, img);
  const tileSize = 64;

  const renderAngle = 90;
  const x = 0;
  const y = 0;

  let left = Math.floor(x * tileSize);
  let top = Math.floor(y * tileSize);

  if (renderAngle == 0) {
    ctx.drawImage(img, left, top, tileSize, tileSize);
  } else {
    const angleInRad = renderAngle * (Math.PI / 180);

    const offset = Math.floor(tileSize / 2);

    left = Math.floor(left + offset);
    top = Math.floor(top + offset);

    ctx.translate(left, top);
    ctx.rotate(angleInRad);

    ctx.drawImage(img, -offset, -offset, tileSize, tileSize);

    ctx.rotate(-angleInRad);
    ctx.translate(-left, -top);
  }

  return true;
};

export default class Board extends React.Component {
  public handleCanvas = canvas => {
    const canvasClass = new CanvasClass(canvas);
    // change to props
    const size = 12;
    const boardSize = new BoardSize(size);

    const renderer = new Renderer(
      TileSet.getTiles(),
      players,
      boardSize,
      canvasClass,
      () => {
        console.log("Renderer loaded!");
      }
    );
  };

  public render() {
    return (
      <View style={styles.container}>
        <Canvas ref={this.handleCanvas} />
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
  }
});
