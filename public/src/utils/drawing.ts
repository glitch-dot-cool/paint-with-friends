import {
  dimensions,
  MAX_FRAMERATE,
  MIN_FRAMERATE,
  ONE_SECOND_IN_MS,
  USER_THROTTLE_THRESHOLD,
} from "../constants.js";
import {
  DrawUpdate,
  BrushShape,
  CanvasDimensions,
  MirrorModeParams,
  SetupShapeReturnValues,
  State,
} from "../../../types";

export const updateDrawing = (p5: p5, paintProperties: DrawUpdate) => {
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
    shouldUseIntrinsicBrightness,
    shouldUseIntrinsicSaturation,
  }: {
    fillColor: DrawUpdate["fillColor"];
    fillOpacity: DrawUpdate["fillOpacity"];
    strokeColor: DrawUpdate["strokeColor"];
    strokeOpacity: DrawUpdate["strokeOpacity"];
    saturation: DrawUpdate["saturation"];
    brightness: DrawUpdate["brightness"];
    shouldUseIntrinsicBrightness: DrawUpdate["shouldUseIntrinsicBrightness"];
    shouldUseIntrinsicSaturation: DrawUpdate["shouldUseIntrinsicSaturation"];
  }
) => {
  const derivedStrokeBrightness = Math.floor(p5.brightness(strokeColor));
  const strokeBrightness = shouldUseIntrinsicBrightness
    ? derivedStrokeBrightness
    : brightness;

  const derivedStrokeSaturation = Math.floor(p5.saturation(strokeColor));
  const strokeSaturation = shouldUseIntrinsicSaturation
    ? derivedStrokeSaturation
    : saturation;

  const strokeHue = Math.floor(p5.hue(strokeColor));
  const stroke = p5.color(
    `hsb(${strokeHue}, ${strokeSaturation}%, ${strokeBrightness}%)`
  );
  stroke.setAlpha(strokeOpacity);

  const derivedFillBrightness = p5.brightness(fillColor);
  const fillBrightness = shouldUseIntrinsicBrightness
    ? derivedFillBrightness
    : brightness;

  const derivedFillSaturation = p5.saturation(fillColor);
  const fillSaturation = shouldUseIntrinsicSaturation
    ? derivedFillSaturation
    : saturation;

  const fillHue = Math.floor(p5.hue(fillColor));
  const fill = p5.color(
    `hsb(${fillHue}, ${fillSaturation}%, ${fillBrightness}%)`
  );
  fill.setAlpha(fillOpacity);

  p5.stroke(stroke);
  p5.fill(fill);
};

const renderShape = (
  p5: p5,
  dimensions: CanvasDimensions,
  params: DrawUpdate
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

const setupShape = (p5: p5, shape: BrushShape, params: DrawUpdate) => {
  const args = setupMirrorArgs(shape, params);

  return {
    fn: p5[shape].bind(p5),
    ...args,
  };
};

const setupMirrorArgs = (
  shape: BrushShape,
  params: DrawUpdate
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

export const getFrameRate = (min: number, max: number, value: number) => {
  if (value <= min) return max;

  const scaled = max - (value * (value * 0.5) - min);

  if (scaled < MIN_FRAMERATE) return MIN_FRAMERATE;
  return Math.floor(scaled);
};

export const getFrametime = (numUsersDrawing: number) => {
  return (
    ONE_SECOND_IN_MS /
    getFrameRate(USER_THROTTLE_THRESHOLD, MAX_FRAMERATE, numUsersDrawing)
  );
};

let throttlePause = false;
export const throttle = (callback: () => void, ms: number) => {
  if (throttlePause) return;

  throttlePause = true;

  setTimeout(() => {
    callback();
    throttlePause = false;
  }, ms);
};
