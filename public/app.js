const app = (s) => {
  const socket = io.connect("http://localhost:3000");
  const guiParams = {
    fillColor: "#349beb",
    fillOpacity: 255,
    strokeColor: "#000000",
    strokeOpacity: 255,
    size: 15,
    sizeMin: 5,
    sizeMax: 300,
    shape: ["circle", "square"],
    mirrorX: false,
    mirrorY: false,
    isRainbowFill: false,
    isRainbowStroke: false,
    rainbowSpeed: 0.5,
    rainbowSpeedMin: 0,
    rainbowSpeedMax: 1,
    rainbowSpeedStep: 0.01,
    isSizeOscillating: false,
    sizeOscSpeed: 0.001,
    sizeOscSpeedMin: 0,
    sizeOscSpeedMax: 0.2,
    sizeOscSpeedStep: 0.001,
    sizeOscAmount: 1,
    sizeOscAmountMin: 0,
    sizeOscAmountMax: 100,
    sizeOscAmountStep: 0.01,
  };

  const state = {
    guiParams,
    rainbowCounter: 0,
    sizeOsc: 0,
  };

  s.setup = function () {
    s.createCanvas(s.windowWidth, s.windowHeight);
    s.background(0);
    s.rectMode(s.CENTER);

    const gui = s.createGui("paintbrush options", this);
    gui.addObject(guiParams);

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
    if (x > 0 && x < s.windowWidth && y > 0 && y < s.windowHeight) {
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
    state.rainbowCounter += 1 * guiParams.rainbowSpeed;

    const hue = Math.floor(state.rainbowCounter % 360);
    const saturation = s.map(s.mouseY, 0, s.windowHeight, 100, 75);
    const brightness = s.map(s.mouseY, 0, s.windowHeight, 100, 50);

    const rainbowFill = s.color(`hsb(${hue}, ${saturation}%, ${brightness}%)`);
    rainbowFill.setAlpha(guiParams.fillOpacity);

    const rainbowStroke = s.color(
      `hsb(${hue}, ${saturation}%, ${brightness}%)`
    );
    rainbowStroke.setAlpha(guiParams.strokeOpacity);

    const paintProperties = {
      x: s.mouseX,
      y: s.mouseY,
      fillColor: guiParams.fillColor,
      fillOpacity: guiParams.fillOpacity,
      strokeColor: guiParams.strokeColor,
      strokeOpacity: guiParams.strokeOpacity,
      size: s.modulateSize(guiParams.size),
      shape: guiParams.shape,
      mirrorX: guiParams.mirrorX,
      mirrorY: guiParams.mirrorY,
      isRainbowFill: guiParams.isRainbowFill,
      isRainbowStroke: guiParams.isRainbowStroke,
      rainbowFill: rainbowFill.toString(),
      rainbowStroke: rainbowStroke.toString(),
    };

    s.updateDrawing(paintProperties);
    socket.emit("update", paintProperties);
  };

  s.modulateSize = (size) => {
    if (guiParams.isSizeOscillating) {
      state.sizeOsc += guiParams.sizeOscSpeed;
      return size + (s.sin(state.sizeOsc) + 1) * guiParams.sizeOscAmount;
    }

    return size;
  };

  s.windowResized = () => {
    s.resizeCanvas(s.windowWidth, s.windowHeight);
    s.background(0);
  };
};

new p5(app);