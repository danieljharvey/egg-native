// @flow

import * as THREE from "three";

export default (loadAsync = async (res, onProgress, assetProvider) => {
  let urls = await resolveAsset(res);
  if (!urls) {
    console.error(
      `ExpoTHREE.loadAsync: Cannot parse undefined assets. Please pass valid resources for: ${res}.`
    );
    return;
  }
  const asset = urls[0];
  let url = await stringFromAsset(asset);

  if (urls.length == 1) {
    if (url.match(/\.(jpeg|jpg|gif|png)$/)) {
      return parseTexture(asset);
    }
    console.error("Unrecognized File Type", url);
  } else {
    console.error("Too many arguments passed", urls);
    return;
  }
});

const loadOBJMTL = async (
  objLocalUri: string,
  mtlLocalUri: string,
  onProgress,
  assetProvider
) => {
  const materials = await loadAsync(mtlLocalUri, onProgress, assetProvider);
  materials.preload();

  require("three/examples/js/loaders/OBJLoader");
  const loader = new THREE.OBJLoader();
  loader.setPath(assetProvider);
  loader.setMaterials(materials);
  const file = await loadRawFileAsync(objLocalUri);
  return loader.parse(file);
};

const loadJsonFile = async (localUri: string) => {
  const fileContents = await loadRawFileAsync(localUri);

  const json = JSON.parse(fileContents);
  return json;
};

const loadRawFileAsync = async (localUri: string): string => {
  console.time("loadAsset");
  console.log("Load local file", localUri);
  let file;
  try {
    file = await Expo.FileSystem.readAsStringAsync(localUri);
  } catch (error) {
    console.log("Error from loadRawFileAsync");
    console.error(error);
  } finally {
    console.timeEnd("loadAsset");
    return file;
  }
};

const loadTexture = function(url, onLoad, onProgress, onError) {
  const texture = new THREE.Texture();
  if (typeof this.path === "function") {
    (async () => {
      url = url.split("/").pop();
      const asset = await this.path(url);
      const { minFilter, image } = await loadAsync(asset);
      texture.image = image;
      texture.needsUpdate = true;
      texture.isDataTexture = true; // Forces passing to `gl.texImage2D(...)` verbatim
      texture.minFilter = minFilter; // Pass-through non-power-of-two

      if (onLoad !== undefined) {
        console.warn("loaded tex", texture);
        onLoad(texture);
      }
    })();
  }

  return texture;
};

/*
  **Super Hack:**
  Override Texture Loader to use the `path` component as a callback to get resources or Expo `Asset`s
*/

THREE.TextureLoader.prototype.load = loadTexture;

function parseTexture(asset) {
  const texture = new THREE.Texture();
  texture.image = {
    data: asset,
    width: asset.width,
    height: asset.height
  };
  texture.needsUpdate = true;
  texture.isDataTexture = true; // Forces passing to `gl.texImage2D(...)` verbatim
  texture.minFilter = THREE.LinearFilter; // Pass-through non-power-of-two
  return texture;
}
