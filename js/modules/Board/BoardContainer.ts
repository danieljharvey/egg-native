import { connect } from 'react-redux'
import Board from "./Board"
import { doGameMove, rotateLeft, rotateRight, togglePause } from "./boardActions"

const mapStateToProps = state => {
  return {
    levelData: state.board.levelData,
    gameState: state.board.gameState,
    canvas: state.board.canvas,
    paused: state.board.paused
  }
}

const mapDispatchToProps = dispatch => {
  return {
    rotateLeft: () => {
      dispatch(rotateLeft())
    },
    rotateRight: () => {
      dispatch(rotateRight())
    },
    doGameMove: (newTime) => dispatch(doGameMove(newTime)),
    togglePause: () => dispatch(togglePause())
  }
}

const BoardComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(Board)

export default BoardComponent