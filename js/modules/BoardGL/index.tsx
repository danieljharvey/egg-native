import React, { Component } from "react";
import { WebGLView } from "react-native-webgl";

const onContextCreate = (gl: WebGLRenderingContext) => {
  const rngl = gl.getExtension("RN");
  gl.clearColor(1, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);
  rngl.endFrame();
};

class RedSquareWebGL extends Component {
  public render() {
    return (
      <WebGLView
        style={{ width: 100, height: 100 }}
        onContextCreate={onContextCreate}
      />
    );
  }
}

export default RedSquareWebGL;
