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
    this.offset.x += movementX * (1 / this.zoomAmount);
    this.offset.y += movementY * (1 / this.zoomAmount);

    this.canvas.style.transform = `scale(${this.zoomAmount}) translate(${this.offset.x}px, ${this.offset.y}px)`;
  };
}
