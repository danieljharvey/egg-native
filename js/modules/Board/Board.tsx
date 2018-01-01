import * as React from "react";
import { StyleSheet, Text, View } from "react-native";
import Canvas, { Image } from "react-native-canvas";

import CanvasClass from "../../interact/Canvas";
import { Renderer } from "../../interact/Renderer";
import { playerTypes } from "../../logic/PlayerTypes";

import { RenderMap } from "../../logic/RenderMap";
import { SavedLevel } from "../../logic/SavedLevel";
import { doAction } from "../../logic/TheEgg";

import * as Map from "../../logic/Map";

import { fromJS } from "immutable";

import * as EventLoop from "../../logic/EventLoop";

interface IBoardProps {
  levelData: {};
}

export default class BoardComponent extends React.Component<IBoardProps> {
  public handleCanvas = canvas => {
    console.log(this.props.levelData);
    EventLoop.handleCanvas(canvas, this.props.levelData);
  };

  public render() {
    const { screenHeight, screenWidth } = EventLoop.getScreenSize();
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
