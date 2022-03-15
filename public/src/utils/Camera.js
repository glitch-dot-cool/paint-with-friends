export class Camera {
  constructor(canvas) {
    this.zoomAmount = 1;
    this.offset = { x: 0, y: 0 };
    this.canvases = {
      app: canvas,
      cursors: null,
    };
    this.maxZoom = 1;
    this.minZoom = 0.2;
    this.scrollSensitivity = 0.001;
  }

  registerCursorCanvas = (canvas) => {
    this.canvases.cursors = canvas;
  };

  _setZoom = (delta) => {
    const rawUpdatedValue = this.zoomAmount + delta * this.scrollSensitivity;
    const constrained = Math.min(
      Math.max(this.minZoom, rawUpdatedValue),
      this.maxZoom
    );

    this.zoomAmount = constrained;
  };

  _setPan = (movementX, movementY) => {
    this.offset.x += Camera.scaleByZoomAmount(movementX, this.zoomAmount);
    this.offset.y += Camera.scaleByZoomAmount(movementY, this.zoomAmount);
  };

  zoom = (delta) => {
    this._setZoom(delta * -1);
    Object.values(this.canvases).forEach((canvas) => {
      if (canvas) this._zoomCanvas(canvas);
    });
  };

  _zoomCanvas = (canvas) => {
    canvas.style.transition = "300ms ease-in-out transform";
    canvas.style.transform = `scale(${this.zoomAmount}) translate(${this.offset.x}px, ${this.offset.y}px)`;
  };

  pan = (movementX, movementY) => {
    this._setPan(movementX, movementY);

    Object.values(this.canvases).forEach((canvas) => {
      if (canvas) this._panCanvas(canvas);
    });
  };

  _panCanvas = (canvas) => {
    canvas.style.transition = "none";
    canvas.style.transform = `scale(${this.zoomAmount}) translate(${this.offset.x}px, ${this.offset.y}px)`;
  };

  static scaleByZoomAmount = (coordinate, zoomAmount) => {
    return coordinate * (1 / zoomAmount);
  };
}
