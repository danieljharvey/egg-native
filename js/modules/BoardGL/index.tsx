import * as React from "react";

import { GLSL, Node, Shaders, Surface } from "gl-react-native";

const shaders = Shaders.create({
  helloBlue: {
    frag: GLSL`
precision highp float;
varying vec2 uv;
uniform float blue;
void main() {
  gl_FragColor = vec4(uv.x, uv.y, blue, 1.0);
}`
  }
});

export default class HelloBlue extends React.Component<any> {
  public render() {
    // const { blue } = this.props;
    const blue = 0.5;
    return (
      <Surface width={300} height={300}>
        <Node shader={shaders.helloBlue} uniforms={{ blue }} />;
      </Surface>
    );
  }
}
