// responsible for the care and feeding of the html canvas and it's size on screen etc etc etc

export default class Canvas {
  protected canvas: HTMLCanvasElement;
  protected ctx: CanvasRenderingContext2D;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
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
}
