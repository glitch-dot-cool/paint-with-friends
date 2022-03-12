export class Zoom {
  constructor(canvas) {
    this.zoom = 1;
    this.origin = { x: 0, y: 0 };
    this.canvas = canvas;
    this.maxZoom = 1;
    this.minZoom = 0.1;
    this.scrollSensitivity = 0.0001;
  }

  set = (delta) => {
    const rawUpdatedValue = this.zoom + delta * this.scrollSensitivity;
    const constrained = Math.min(
      Math.max(this.minZoom, rawUpdatedValue),
      this.maxZoom
    );

    this.zoom = constrained;
  };

  scaleAt = (x, y) => {
    this.origin.x = x - (x - this.origin.x) * this.zoom;
    this.origin.y = y - (y - this.origin.y) * this.zoom;
    // console.log(this.zoom, this.origin.x, this.origin.y);
    this.canvas.style.transform = `scale(${this.zoom}) translate(${this.origin.x}px, ${this.origin.y}px)`;
  };

  toWorldSpace = (x, y) => {
    x = (x - this.origin.x) / zoom;
    y = (y - this.origin.y) / zoom;
    return { x, y };
  };

  toScreenSpace = (x, y) => {
    x = x * zoom + this.origin.x;
    y = y * zoom + this.origin.y;
    return { x, y };
  };
}
