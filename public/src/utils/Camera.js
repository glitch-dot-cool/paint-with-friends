export class Camera {
  static isActive = true;

  constructor(canvas) {
    this.zoomAmount = 1;
    this.maxZoom = 1;
    this.minZoom = 0.2;
    this.scrollSensitivity = 0.001;
    this.offset = { x: 0, y: 0 };
    this.canvases = {
      app: canvas,
      cursors: null,
    };
  }

  static scaleByZoomAmount = (coordinate, zoomAmount) => {
    return coordinate * (1 / zoomAmount);
  };

  static activate = () => (Camera.isActive = true);

  static deactivate = () => (Camera.isActive = false);

  registerCursorCanvas = (canvas) => {
    this.canvases.cursors = canvas;
  };

  zoom = (delta) => {
    if (Camera.isActive) {
      this._setZoom(delta * -1);
      this._applyToCanvases(this._zoomCanvas);
    }
  };

  pan = (movementX, movementY) => {
    if (Camera.isActive) {
      this._setPan(movementX, movementY);
      this._applyToCanvases(this._panCanvas);
    }
  };

  _setZoom = (delta) => {
    const rawUpdatedValue = this.zoomAmount + delta * this.scrollSensitivity;
    const constrained = Math.min(
      Math.max(this.minZoom, rawUpdatedValue),
      this.maxZoom
    );

    this.zoomAmount = constrained;
  };

  _zoomCanvas = (canvas) => {
    canvas.style.transition = "300ms ease-in-out transform";
    canvas.style.transform = `scale(${this.zoomAmount}) translate(${this.offset.x}px, ${this.offset.y}px)`;
  };

  _setPan = (movementX, movementY) => {
    this.offset.x += Camera.scaleByZoomAmount(movementX, this.zoomAmount);
    this.offset.y += Camera.scaleByZoomAmount(movementY, this.zoomAmount);
  };

  _panCanvas = (canvas) => {
    canvas.style.transition = "none";
    canvas.style.transform = `scale(${this.zoomAmount}) translate(${this.offset.x}px, ${this.offset.y}px)`;
  };

  _applyToCanvases = (transform) => {
    Object.values(this.canvases).forEach((canvas) => {
      if (canvas) transform(canvas);
    });
  };
}
