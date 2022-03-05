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

const renderShape = (
  p5,
  dimensions,
  { x, y, size, shape, mirrorX, mirrorY, prevX, prevY }
) => {
  if (x > 0 && x < dimensions.width && y > 0 && y < dimensions.height) {
    const { width, height } = dimensions;

    const defaultArgs = [x, y, size];
    const defaultMirrorXArgs = [width - x, y, size];
    const defaultMirrorYArgs = [x, height - y, size];
    const defaultMirrorXAndYArgs = [width - x, height - y, size];
    switch (shape) {
      case "circle":
        handleMirrorMode(
          setupShape(
            p5.circle.bind(p5),
            defaultArgs,
            defaultMirrorXArgs,
            defaultMirrorYArgs,
            defaultMirrorXAndYArgs
          ),
          mirrorX,
          mirrorY
        );
        break;
      case "square":
        handleMirrorMode(
          setupShape(
            p5.square.bind(p5),
            defaultArgs,
            defaultMirrorXArgs,
            defaultMirrorYArgs,
            defaultMirrorXAndYArgs
          ),
          mirrorX,
          mirrorY
        );
        break;
      case "line":
        const defaultLineArgs = [prevX, prevY, x, y];
        const mirrorXArgs = [width - prevX, prevY, width - x, y];
        const mirrorYArgs = [prevX, height - prevY, x, height - y];
        const mirrorXAndYArgs = [
          width - prevX,
          height - prevY,
          width - x,
          height - y,
        ];

        handleMirrorMode(
          setupShape(
            p5.line.bind(p5),
            defaultLineArgs,
            mirrorXArgs,
            mirrorYArgs,
            mirrorXAndYArgs
          ),
          mirrorX,
          mirrorY
        );
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

const setupShape = (
  shape,
  defaultArgs,
  mirrorXArgs,
  mirrorYArgs,
  mirrorXAndYArgs
) => {
  return {
    fn: shape,
    defaultArgs,
    mirrorXArgs,
    mirrorYArgs,
    mirrorXAndYArgs,
  };
};
