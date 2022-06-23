class Camera {
  zoomAmount: number;
  maxZoom: number;
  minZoom: number;
  scrollSensitivity: number;
  offset: { x: number; y: number };
  canvases: {
    app: HTMLCanvasElement | null;
    cursors: HTMLCanvasElement | null;
  };
  isActive: boolean;

  constructor() {
    this.zoomAmount = 1;
    this.maxZoom = 1;
    this.minZoom = 0.3;
    this.scrollSensitivity = 0.0005;
    this.offset = { x: 0, y: 0 };
    this.canvases = {
      app: null,
      cursors: null,
    };
    this.isActive = true;
  }

  static scaleByZoomAmount = (coordinate: number, zoomAmount: number) => {
    return coordinate * (1 / zoomAmount);
  };

  activate = () => (this.isActive = true);

  deactivate = () => (this.isActive = false);

  registerCanvas = (canvas: HTMLCanvasElement, name: "app" | "cursors") => {
    this.canvases[name] = canvas;
  };

  zoom = (delta: number) => {
    if (this.isActive) {
      this._setZoom(delta * -1);
      this._applyToCanvases(this._zoomCanvas);
    }
  };

  pan = (movementX: number, movementY: number) => {
    if (this.isActive) {
      this._setPan(movementX, movementY);
      this._applyToCanvases(this._panCanvas);
    }
  };

  _setZoom = (delta: number) => {
    const rawUpdatedValue = this.zoomAmount + delta * this.scrollSensitivity;
    const constrained = Math.min(
      Math.max(this.minZoom, rawUpdatedValue),
      this.maxZoom
    );

    this.zoomAmount = constrained;
  };

  _zoomCanvas = (canvas: HTMLCanvasElement) => {
    canvas.style.transition = "300ms ease-in-out transform";
    canvas.style.transform = `scale(${this.zoomAmount}) translate(${this.offset.x}px, ${this.offset.y}px)`;
  };

  _setPan = (movementX: number, movementY: number) => {
    this.offset.x += Camera.scaleByZoomAmount(movementX, this.zoomAmount);
    this.offset.y += Camera.scaleByZoomAmount(movementY, this.zoomAmount);
  };

  _panCanvas = (canvas: HTMLCanvasElement) => {
    canvas.style.transition = "none";
    canvas.style.transform = `scale(${this.zoomAmount}) translate(${this.offset.x}px, ${this.offset.y}px)`;
  };

  _applyToCanvases = (transform: (canvas: HTMLCanvasElement) => void) => {
    Object.values(this.canvases).forEach((canvas) => {
      if (canvas) transform(canvas);
    });
  };
}

const camera = new Camera();
// camera = singleton instance, Camera for using static methods
export { camera, Camera };
