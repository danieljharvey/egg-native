// responsible for the care and feeding of the html canvas and it's size on screen etc etc etc

export default class Canvas {
  protected canvas: HTMLCanvasElement;
  protected ctx: CanvasRenderingContext2D;
  protected width: number;
  protected height: number;

  constructor(canvas: HTMLCanvasElement, width, height) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.width = width;
    this.height = height;
    this.sizeCanvas(width, height);
  }

  public sizeCanvas(width, height) {
    const size = Math.min(width, height);
    this.canvas.width = size;
    this.canvas.height = size;
  }

  public getDrawingContext() {
    return this.ctx;
  }

  public getCanvas() {
    return this.canvas;
  }

  public wipeCanvas(fillStyle: string): void {
    this.ctx.fillStyle = fillStyle;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  public calcTileSize(boardSize) {
    const { width, height } = boardSize.getData();
    const tileSize = Math.floor(this.width / width);
    return tileSize;
  }
}
