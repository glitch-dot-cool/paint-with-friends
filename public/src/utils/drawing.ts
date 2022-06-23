import { dimensions } from "../constants.js";
import {
  BrushShape,
  CanvasDimensions,
  MirrorModeParams,
  Paintbrush,
  SetupShapeReturnValues,
  State,
} from "../types/paint.js";

export const updateDrawing = (p5: p5, paintProperties: Paintbrush) => {
  handleColor(p5, paintProperties);
  renderShape(p5, dimensions, paintProperties);
};

const handleColor = (
  p5: p5,
  {
    fillColor,
    fillOpacity,
    strokeColor,
    strokeOpacity,
    saturation,
    brightness,
  }: {
    fillColor: Paintbrush["fillColor"];
    fillOpacity: Paintbrush["fillOpacity"];
    strokeColor: Paintbrush["strokeColor"];
    strokeOpacity: Paintbrush["strokeOpacity"];
    saturation: Paintbrush["saturation"];
    brightness: Paintbrush["brightness"];
  }
) => {
  const strokeHue = Math.floor(p5.hue(strokeColor));
  const stroke = p5.color(`hsb(${strokeHue}, ${saturation}%, ${brightness}%)`);
  stroke.setAlpha(strokeOpacity);

  const fillHue = Math.floor(p5.hue(fillColor));
  const fill = p5.color(`hsb(${fillHue}, ${saturation}%, ${brightness}%)`);
  fill.setAlpha(fillOpacity);

  p5.stroke(stroke);
  p5.fill(fill);
};

const renderShape = (
  p5: p5,
  dimensions: CanvasDimensions,
  params: Paintbrush
) => {
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
        break;
      case "text":
        p5.textSize(params.size);
        handleMirrorMode(setupShape(p5, "text", params), mirrorX, mirrorY);
        break;
    }
  }
};

const handleMirrorMode = (
  {
    fn,
    default: defaultArgs,
    mirrorX: mirrorXArgs,
    mirrorY: mirrorYArgs,
    mirrorBoth: mirrorXAndYArgs,
  }: MirrorModeParams,
  mirrorX: boolean,
  mirrorY: boolean
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

const setupShape = (p5: p5, shape: BrushShape, params: Paintbrush) => {
  const args = setupMirrorArgs(shape, params);

  return {
    fn: p5[shape].bind(p5),
    ...args,
  };
};

const setupMirrorArgs = (
  shape: BrushShape,
  params: Paintbrush
): SetupShapeReturnValues => {
  const { width, height } = dimensions;
  const { x, y, prevX, prevY, size, text } = params;

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
    case "text":
      return {
        default: [text, x, y],
        mirrorX: [text, width - x, y],
        mirrorY: [text, x, height - y],
        mirrorBoth: [text, width - x, height - y],
      };
  }
};

export const toggleDrawMode = (state: State) => {
  state.isDrawing = !state.isDrawing;
  toggleCursor(state);
};

export const toggleCursor = (state: State) => {
  if (state.isDrawing) {
    document.body.style.cursor = "crosshair";
  } else {
    document.body.style.cursor = "grab";
  }
};
