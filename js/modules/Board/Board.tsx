import * as React from "react";
import { StyleSheet, Text, TouchableHighlight, View } from "react-native";
import Canvas, { Image } from "react-native-canvas";

import GestureRecognizer, {
  swipeDirections
} from "react-native-swipe-gestures";

import CanvasClass from "../../interact/Canvas";
import { Renderer } from "../../interact/Renderer";
import { playerTypes } from "../../logic/PlayerTypes";

import { RenderMap } from "../../logic/RenderMap";
import { SavedLevel } from "../../logic/SavedLevel";
import { doAction } from "../../logic/TheEgg";

import * as Map from "../../logic/Map";

import { fromJS } from "immutable";

import * as EventLoop from "../../logic/EventLoop";
import { GameState } from "../../objects/GameState";

interface IBoardProps {
  levelData: {};
  gameState: GameState;
  paused: boolean;
  rotateLeft: () => any;
  rotateRight: () => any;
  doGameMove: ((newTime: number) => any);
  canvas: CanvasClass;
  togglePause: () => any;
}

interface IBoardState {
  renderer: any;
}

export default class BoardComponent extends React.Component<
  IBoardProps,
  IBoardState
> {
  constructor(props) {
    super(props);
    this.state = {
      renderer: null
    };
  }
  public handleCanvas = canvas => {
    EventLoop.handleCanvas(canvas, this.props.levelData, renderer => {
      this.setState({ renderer });
      this.eventLoop(10);
    });
  };

  public eventLoop = newTime => {
    const anim = window.requestAnimationFrame(this.eventLoop);
    this.props.doGameMove(newTime);
  };

  public shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.paused !== this.props.paused) {
      return true;
    }
    const oldGameState = this.props.gameState;
    const newGameState = nextProps.gameState;
    // to stop it fucking up on first load before we have a proper title screen and loading thing
    if (!oldGameState || !newGameState) {
      return false;
    }
    EventLoop.renderChanges(this.state.renderer, oldGameState, newGameState);
    return false;
  }

  public render() {
    const pauseText = this.props.paused ? "PRESS TO START" : "PRESS TO STOP";
    const { screenHeight, screenWidth } = EventLoop.getScreenSize();
    const size = Math.min(screenHeight, screenWidth);
    return (
      <GestureRecognizer
        onSwipeLeft={() => this.props.rotateLeft()}
        onSwipeRight={() => this.props.rotateRight()}
      >
        <View style={styles.container}>
          <Canvas
            style={{ width: size, height: size }}
            ref={this.handleCanvas}
          />
        </View>
        <TouchableHighlight onPress={() => this.props.togglePause()}>
          <Text>{pauseText}</Text>
        </TouchableHighlight>
      </GestureRecognizer>
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
