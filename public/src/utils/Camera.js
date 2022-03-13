export class Camera {
  constructor(canvas) {
    this.zoomAmount = 1;
    this.offset = { x: 0, y: 0 };
    this.canvas = canvas;
    this.maxZoom = 1;
    this.minZoom = 0.1;
    this.scrollSensitivity = 0.001;
  }

  set = (delta) => {
    const rawUpdatedValue = this.zoomAmount + delta * this.scrollSensitivity;
    const constrained = Math.min(
      Math.max(this.minZoom, rawUpdatedValue),
      this.maxZoom
    );

    this.zoomAmount = constrained;
  };

  zoom = () => {
    this.canvas.style.transform = `scale(${this.zoomAmount}) translate(${this.offset.x}px, ${this.offset.y}px)`;
  };

  pan = (movementX, movementY) => {
    this.offset.x += movementX;
    this.offset.y += movementY;

    this.canvas.style.transform = `scale(${this.zoomAmount}) translate(${this.offset.x}px, ${this.offset.y}px)`;
  };

  // toWorldSpace = (x, y) => {
  //   x = (x - this.origin.x) / zoom;
  //   y = (y - this.origin.y) / zoom;
  //   return { x, y };
  // };

  // toScreenSpace = (x, y) => {
  //   x = x * zoom + this.origin.x;
  //   y = y * zoom + this.origin.y;
  //   return { x, y };
  // };
}
