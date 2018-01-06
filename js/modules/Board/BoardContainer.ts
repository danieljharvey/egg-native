import { connect } from 'react-redux'
import Board from "./Board"
import { rotateLeft, rotateRight } from "./boardActions"

const mapStateToProps = state => {
  return {
    levelData: state.board.levelData
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
  }
}

const BoardComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(Board)

export default BoardComponent