import * as React from "react";
import { StyleSheet, Text, View } from "react-native";
import Board from "./js/modules/Board/BoardContainer";

import { Provider } from "react-redux";

import store from "./js/store";

export default class App extends React.Component {
  public render() {
    return (
      <View style={styles.container}>
        <Provider store={store}>
          <Board />
        </Provider>
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
