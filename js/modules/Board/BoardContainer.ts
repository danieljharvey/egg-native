import { connect } from 'react-redux'
import Board from "./Board"

const mapStateToProps = state => {
  return {
    levelData: state.board.levelData
  }
}

const mapDispatchToProps = dispatch => {
  return {
    /*onTodoClick: id => {
      dispatch(toggleTodo(id))
    }*/
  }
}

const BoardComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(Board)

export default BoardComponent