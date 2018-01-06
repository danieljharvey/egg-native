import { connect } from 'react-redux'
import Board from "./Board"
import { doGameMove, rotateLeft, rotateRight } from "./boardActions"

const mapStateToProps = state => {
  return {
    levelData: state.board.levelData,
    gameState: state.board.gameState,
    canvas: state.board.canvas
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
    doGameMove: () => dispatch(doGameMove())
  }
}

const BoardComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(Board)

export default BoardComponent