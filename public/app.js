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
  }) => {
    const stroke = s.color(strokeColor);
    stroke.setAlpha(strokeOpacity);

    const fill = s.color(fillColor);
    fill.setAlpha(fillOpacity);

    s.stroke(stroke);
    s.fill(fill);

    s.renderShape(x, y, size, shape, mirrorX, mirrorY, rainbowToggle);
  };

  s.renderShape = (x, y, size, shape, mirrorX, mirrorY) => {
    switch (shape) {
      case "circle":
        s.handleAltModes(s.circle.bind(s), x, y, size, mirrorX, mirrorY);
        break;
      case "square":
        s.handleAltModes(s.square.bind(s), x, y, size, mirrorX, mirrorY);
        break;
    }
  };

  s.handleAltModes = (shape, x, y, size, mirrorX, mirrorY, RainbowToggle) => {
    shape(x, y, size);
    if (mirrorX && mirrorY) {
      shape(s.windowWidth - x, s.windowHeight - y, size);
    } else if (mirrorX) {
      shape(s.windowWidth - x, y, size);
    } else if (mirrorY) {
      shape(x, s.windowHeight - y, size);
    }
  };

  s.mouseDragged = () => {
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
