import React from "react";
import { StyleSheet, View } from "react-native";
import { WebGLView } from "react-native-webgl";
import * as THREE from "three";
// import { loadAsync } from "./loadTexture"

if (!window.addEventListener) {
  window.addEventListener = () => { };
}
 
export default class WebGLFace extends React.Component {
  protected requestId: *;
  public componentWillUnmount() {
    cancelAnimationFrame(this.requestId);
  }
  public onContextCreate = (gl: WebGLRenderingContext) => {
    const rngl = gl.getExtension("RN");

    const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;
    const renderer = new THREE.WebGLRenderer({
      canvas: {
        width,
        height,
        style: {},
        addEventListener: () => {},
        removeEventListener: () => {},
        clientHeight: height
      },
      context: gl,
      // alpha:true
    });
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 1);

    let camera
    let scene;
    const cubes = [];

    const createTexture = (asset) => {
      return new Promise((resolve, reject) => {
        const textureObj = new THREE.Texture();

        const properties = renderer.properties.get(textureObj);
        rngl.loadTexture({ yflip: true, image: asset })
          .then(({ texture }) => {
            properties.__webglTexture = texture;
            properties.__webglInit = true;
            texture.needsUpdate = true;

            const material = new THREE.MeshBasicMaterial({
              map: textureObj,
              transparent: true
            });

            resolve(material)
        })
      })
    }

    const createCube = (threeScene) => (x,y, material) => {
      const size = 50

      const geometry = new THREE.BoxGeometry(size, size, size);

      const cube = new THREE.Mesh(geometry, material);
      cube.position.y = y * size
      cube.position.x = x * size

      threeScene.add(cube);      
      cubes.push(cube)
    }

    function init() {
      camera = new THREE.PerspectiveCamera(75, width / height, 1, 1000);
      camera.position.x = 250
      camera.position.y = 250;
      camera.position.z = 400;
      scene = new THREE.Scene();
      const asset = require("../../assets/images/tiles/cacti.png")

      createTexture(asset).then(material => {
        for (let x = 0; x < 10; x++) {
          for (let y = 0; y < 10; y++) {
            createCube(scene)(x,y, material)
          }
        } 
      })
      

    }


    

    const animate = () => {
      
      renderer.render(scene, camera);

      cubes.map(cube => {
        cube.rotation.y += 0.05;
        cube.rotation.x += 0.0001
        cube.rotation.z += 0.0002
      })

      gl.flush();
      rngl.endFrame();

      this.requestId = requestAnimationFrame(animate);
    };

    init();
    animate();
  };

  public render() {
    return (
      <View style={styles.container}>
        <WebGLView
          style={styles.webglView}
          onContextCreate={this.onContextCreate}
        />
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
  },
  webglView: {
    width: 300,
    height: 300
  }
});