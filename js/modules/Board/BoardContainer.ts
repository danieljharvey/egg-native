import { connect } from "react-redux";
import Board from "./Board";
import {
  doGameMove,
  rotateLeft,
  rotateRight,
  togglePause,
  updateRenderer
} from "./boardActions";

const mapStateToProps = state => {
  return {
    levelData: state.board.levelData,
    gameState: state.board.gameState,
    renderer: state.board.renderer,
    paused: state.board.paused,
    imageData: state.board.imageData,
    drawAngle: state.board.drawAngle,
    nextAction: state.board.nextAction
  };
};

const mapDispatchToProps = dispatch => {
  return {
    rotateLeft: () => {
      dispatch(rotateLeft());
    },
    rotateRight: () => {
      dispatch(rotateRight());
    },
    doGameMove: newTime => dispatch(doGameMove(newTime)),
    togglePause: () => dispatch(togglePause()),
    updateRenderer: renderer => dispatch(updateRenderer(renderer))
  };
};

const BoardComponent = connect(mapStateToProps, mapDispatchToProps)(Board);

export default BoardComponent;
