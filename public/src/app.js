import { state } from "./initialState.js";
import { dimensions } from "./constants.js";
import { setupPaintProperties } from "./utils/setupPaintProperties.js";

const app = (s) => {
  const socket = io.connect("http://localhost:3000");

  s.setup = function () {
    s.createCanvas(dimensions.width, dimensions.height); // 1080p-friendly
    s.background(0);
    s.rectMode(s.CENTER);

    const gui = s.createGui("paintbrush options", this);
    gui.addObject(state.gui);

    socket.on("update", (paintProperties) => {
      s.updateDrawing(paintProperties);
    });
  };

  s.updateDrawing = ({
    x,
    y,
    fillColor,
    fillOpacity,
    strokeColor,
    strokeOpacity,
    size,
    shape,
    mirrorX,
    mirrorY,
    isRainbowFill,
    isRainbowStroke,
    rainbowFill,
    rainbowStroke,
  }) => {
    s.handleColor(
      fillColor,
      fillOpacity,
      strokeColor,
      strokeOpacity,
      isRainbowFill,
      isRainbowStroke,
      rainbowFill,
      rainbowStroke
    );

    s.renderShape(x, y, size, shape, mirrorX, mirrorY);
  };

  s.renderShape = (x, y, size, shape, mirrorX, mirrorY) => {
    if (x > 0 && x < dimensions.width && y > 0 && y < dimensions.height) {
      switch (shape) {
        case "circle":
          s.handleMirrorMode(s.circle.bind(s), x, y, size, mirrorX, mirrorY);
          break;
        case "square":
          s.handleMirrorMode(s.square.bind(s), x, y, size, mirrorX, mirrorY);
          break;
      }
    }
  };

  s.handleMirrorMode = (shape, x, y, size, mirrorX, mirrorY) => {
    shape(x, y, size);
    if (mirrorX && mirrorY) {
      shape(s.windowWidth - x, s.windowHeight - y, size);
    } else if (mirrorX) {
      shape(s.windowWidth - x, y, size);
    } else if (mirrorY) {
      shape(x, s.windowHeight - y, size);
    }
  };

  s.handleColor = (
    fillColor,
    fillOpacity,
    strokeColor,
    strokeOpacity,
    isRainbowFill,
    isRainbowStroke,
    rainbowFill,
    rainbowStroke
  ) => {
    const stroke = s.color(strokeColor);
    stroke.setAlpha(strokeOpacity);

    const fill = s.color(fillColor);
    fill.setAlpha(fillOpacity);

    if (isRainbowFill && isRainbowStroke) {
      s.stroke(rainbowStroke);
      s.fill(rainbowFill);
    } else if (isRainbowFill) {
      s.fill(rainbowFill);
      s.stroke(stroke);
    } else if (isRainbowStroke) {
      s.fill(fill);
      s.stroke(rainbowStroke);
    } else {
      s.stroke(stroke);
      s.fill(fill);
    }
  };

  s.mouseDragged = () => {
    const paintProperties = setupPaintProperties(s, state);
    s.updateDrawing(paintProperties);
    socket.emit("update", paintProperties);
  };

  s.modulateSize = (size) => {
    if (state.gui.isSizeOscillating) {
      state.sizeOsc += state.gui.sizeOscSpeed;
      return size + (s.sin(state.sizeOsc) + 1) * state.gui.sizeOscAmount;
    }

    return size;
  };

  s.keyPressed = () => {
    // p key
    if (s.keyCode === 80) {
      s.save("paint with friends.png", false); // false prevents canvas from being cleared
    }
  };
};

new p5(app);
