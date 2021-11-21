const app = (s) => {
  const socket = io.connect("http://localhost:3000");
  const guiParams = {
    fillColor: "#349beb",
    fillOpacity: 100,
    strokeColor: "#000000",
    strokeOpacity: 100,
    size: 15,
    shape: ["circle", "square"],
    mirrorX: false,
    mirrorY: false,
    rainbowToggle: false,
    rainbowSpeed: 1,
    rainbowSpeedMin: 0,
    rainbowSpeedMax: 1,
    rainbowSpeedStep: 0.01,
  };

  const state = {
    guiParams,
    rainbowCounter: 0,
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
    rainbowToggle,
    rainbowColor,
  }) => {
    s.handleColor(
      fillColor,
      fillOpacity,
      strokeColor,
      strokeOpacity,
      rainbowToggle,
      rainbowColor
    );

    s.renderShape(x, y, size, shape, mirrorX, mirrorY, rainbowToggle);
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
    rainbowToggle,
    rainbowColor
  ) => {
    if (!rainbowToggle) {
      const stroke = s.color(strokeColor);
      stroke.setAlpha(strokeOpacity);

      const fill = s.color(fillColor);
      fill.setAlpha(fillOpacity);

      s.stroke(stroke);
      s.fill(fill);
    } else {
      s.stroke(rainbowColor);
      s.fill(rainbowColor);
    }
  };

  s.mouseDragged = () => {
    state.rainbowCounter += 1 * guiParams.rainbowSpeed;

    const hue = Math.floor(state.rainbowCounter % 360);
    const saturation = s.map(s.mouseY, 0, s.windowHeight, 100, 75);
    const brightness = s.map(s.mouseY, 0, s.windowHeight, 100, 50);

    const rainbow = s.color(`hsb(${hue}, ${saturation}%, ${brightness}%)`);
    rainbow.setAlpha(guiParams.fillOpacity);

    const paintProperties = {
      x: s.mouseX,
      y: s.mouseY,
      fillColor: guiParams.fillColor,
      fillOpacity: guiParams.fillOpacity,
      strokeColor: guiParams.strokeColor,
      strokeOpacity: guiParams.strokeOpacity,
      size: guiParams.size,
      shape: guiParams.shape,
      mirrorX: guiParams.mirrorX,
      mirrorY: guiParams.mirrorY,
      rainbowToggle: guiParams.rainbowToggle,
      rainbowColor: rainbow.toString(),
    };

    s.updateDrawing(paintProperties);
    socket.emit("update", paintProperties);
  };

  s.windowResized = () => {
    s.resizeCanvas(s.windowWidth, s.windowHeight);
    s.background(0);
  };
};

new p5(app);
