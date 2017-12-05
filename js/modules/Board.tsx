import * as React from "react";
import { StyleSheet, Text, View } from "react-native";
import Canvas, { Image } from "react-native-canvas";

import CanvasClass from "../interact/Canvas";
import { Renderer } from "../interact/Renderer";
import { PlayerTypes } from "../logic/PlayerTypes";
import { BoardSize } from "../objects/BoardSize";

const playerTypes = new PlayerTypes();
const players = playerTypes.getPlayerTypes();

const SPRITE_SIZE = 64;

const cacti =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAxJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RkFDOUEzNzA1Q0E0MTFFNzlBRjBENkQ4RUJGMDU5RjciIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RkFDOUEzNkY1Q0E0MTFFNzlBRjBENkQ4RUJGMDU5RjciIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiBNYWNpbnRvc2giPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0iN0NFNEY4MTUxRkZEREI4MzFGNzVEQUI0MDE2MzE4NzYiIHN0UmVmOmRvY3VtZW50SUQ9IjdDRTRGODE1MUZGRERCODMxRjc1REFCNDAxNjMxODc2Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+DIXjHwAADlhJREFUeNrsW2lsXOd1PW9f5s0+HA53kdTCWEtk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";

const loadImage = (canvas, ctx) => {
  const height = 64;
  const width = 64;

  const imageUri = { uri: "cacti" };

  // Do something with the base64 string
  const image = new Image(canvas, height, width);
  image.src = cacti;
  image.addEventListener("load", () => {
    console.log("IMAGE LOADED");
    drawImage(ctx, image);
  });

  image.width = SPRITE_SIZE.toString();
  image.height = SPRITE_SIZE.toString();
  console.log(image);
};

const drawImage = (ctx, img) => {
  console.log("drawImage", ctx, img);
  const tileSize = 64;

  const renderAngle = 90;
  const x = 0;
  const y = 0;

  let left = Math.floor(x * tileSize);
  let top = Math.floor(y * tileSize);

  if (renderAngle === 0) {
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

    const renderer = new Renderer({}, players, boardSize, canvasClass, () => {
      console.log("renderer loaded!");
    });
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
