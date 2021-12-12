import { dimensions } from "../constants.js";

export const updateDrawing = (p5, paintProperties) => {
  handleColor(p5, paintProperties);
  renderShape(p5, dimensions, paintProperties);
};

const handleColor = (
  p5,
  {
    fillColor,
    fillOpacity,
    strokeColor,
    strokeOpacity,
    isRainbowFill,
    isRainbowStroke,
    rainbowFill,
    rainbowStroke,
  }
) => {
  const stroke = p5.color(strokeColor);
  stroke.setAlpha(strokeOpacity);

  const fill = p5.color(fillColor);
  fill.setAlpha(fillOpacity);

  if (isRainbowFill && isRainbowStroke) {
    p5.stroke(rainbowStroke);
    p5.fill(rainbowFill);
  } else if (isRainbowFill) {
    p5.fill(rainbowFill);
    p5.stroke(stroke);
  } else if (isRainbowStroke) {
    p5.fill(fill);
    p5.stroke(rainbowStroke);
  } else {
    p5.stroke(stroke);
    p5.fill(fill);
  }
};

const renderShape = (
  p5,
  dimensions,
  { x, y, size, shape, mirrorX, mirrorY }
) => {
  if (x > 0 && x < dimensions.width && y > 0 && y < dimensions.height) {
    switch (shape) {
      case "circle":
        handleMirrorMode(p5, p5.circle.bind(p5), x, y, size, mirrorX, mirrorY);
        break;
      case "square":
        handleMirrorMode(p5, p5.square.bind(p5), x, y, size, mirrorX, mirrorY);
        break;
    }
  }
};

const handleMirrorMode = (p5, shape, x, y, size, mirrorX, mirrorY) => {
  shape(x, y, size);
  if (mirrorX && mirrorY) {
    shape(p5.windowWidth - x, p5.windowHeight - y, size);
  } else if (mirrorX) {
    shape(p5.windowWidth - x, y, size);
  } else if (mirrorY) {
    shape(x, p5.windowHeight - y, size);
  }
};
