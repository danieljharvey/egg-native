import * as React from "react";
import { StyleSheet, Text, View } from "react-native";
import Board from "./js/modules/Board/BoardContainer";
import BoardGL from "./js/modules/BoardGL";

import { Provider } from "react-redux";
import { createStore } from "redux";
import eggNative from "./js/store";

const store = createStore(eggNative);

export default class App extends React.Component {
  public render() {
    return (
      <View style={styles.container}>
        <Provider store={store}>
          <BoardGL />
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
