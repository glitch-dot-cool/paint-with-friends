import { dimensions } from "../constants.js";

export const updateDrawing = (p5, paintProperties) => {
  handleColor(p5, paintProperties);
  renderShape(p5, dimensions, paintProperties);
};

const handleColor = (
  p5,
  { fillColor, fillOpacity, strokeColor, strokeOpacity }
) => {
  const stroke = p5.color(strokeColor);
  stroke.setAlpha(strokeOpacity);

  const fill = p5.color(fillColor);
  fill.setAlpha(fillOpacity);

  p5.stroke(stroke);
  p5.fill(fill);
};

const renderShape = (p5, dimensions, params) => {
  const { x, y, shape, mirrorX, mirrorY, strokeWeight } = params;
  p5.strokeWeight(strokeWeight);

  if (x > 0 && x < dimensions.width && y > 0 && y < dimensions.height) {
    switch (shape) {
      case "circle":
        handleMirrorMode(setupShape(p5, "circle", params), mirrorX, mirrorY);
        break;
      case "square":
        handleMirrorMode(setupShape(p5, "square", params), mirrorX, mirrorY);
        break;
      case "line":
        handleMirrorMode(setupShape(p5, "line", params), mirrorX, mirrorY);
    }
  }
};

const handleMirrorMode = (
  { fn, defaultArgs, mirrorXArgs, mirrorYArgs, mirrorXAndYArgs },
  mirrorX,
  mirrorY
) => {
  fn(...defaultArgs);
  if (mirrorX && mirrorY) {
    fn(...mirrorXAndYArgs);
  } else if (mirrorX) {
    fn(...mirrorXArgs);
  } else if (mirrorY) {
    fn(...mirrorYArgs);
  }
};

const setupShape = (p5, shape, params) => {
  const args = setupMirrorArgs(shape, params);

  return {
    fn: p5[shape].bind(p5),
    defaultArgs: args.default,
    mirrorXArgs: args.mirrorX,
    mirrorYArgs: args.mirrorY,
    mirrorXAndYArgs: args.mirrorBoth,
  };
};

const setupMirrorArgs = (shape, params) => {
  const { width, height } = dimensions;
  const { x, y, prevX, prevY, size } = params;

  switch (shape) {
    case "circle":
    case "square":
      return {
        default: [x, y, size],
        mirrorX: [width - x, y, size],
        mirrorY: [x, height - y, size],
        mirrorBoth: [width - x, height - y, size],
      };

    case "line":
      return {
        default: [prevX, prevY, x, y],
        mirrorX: [width - prevX, prevY, width - x, y],
        mirrorY: [prevX, height - prevY, x, height - y],
        mirrorBoth: [width - prevX, height - prevY, width - x, height - y],
      };
  }
};

export const toggleDrawMode = (state) => {
  state.isDrawing = !state.isDrawing;
  toggleCursor(state);
};

export const toggleCursor = (state) => {
  if (state.isDrawing) {
    document.body.style.cursor = "crosshair";
  } else {
    document.body.style.cursor = "grab";
  }
};
