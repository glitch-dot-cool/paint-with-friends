export class Camera {
  constructor(canvas) {
    this.zoomAmount = 1;
    this.offset = { x: 0, y: 0 };
    this.canvas = canvas;
    this.maxZoom = 1;
    this.minZoom = 0.2;
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
    this.canvas.style.transition = "300ms ease-in-out transform";
    this.canvas.style.transform = `scale(${this.zoomAmount}) translate(${this.offset.x}px, ${this.offset.y}px)`;
  };

  pan = (movementX, movementY) => {
    this.canvas.style.transition = "none";
    this.offset.x += Camera.scaleByZoomAmount(movementX, this.zoomAmount);
    this.offset.y += Camera.scaleByZoomAmount(movementY, this.zoomAmount);

    this.canvas.style.transform = `scale(${this.zoomAmount}) translate(${this.offset.x}px, ${this.offset.y}px)`;
  };

  static scaleByZoomAmount = (coordinate, zoomAmount) => {
    return coordinate * (1 / zoomAmount);
  };
}
