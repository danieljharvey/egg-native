interface RNCanvasElement extends HTMLCanvasElement {
  toDataURL: (string) => Promise<string>;
}

interface RNImage extends Image {
  new: (canvas: RNCanvasElement, width: number, height: number) => Image;
  src: string;
  addEventListener: (event: string, callback: () => any) => void;
}
