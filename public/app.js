const app = (s) => {
  const socket = io.connect("http://localhost:3000");
  const guiParams = {
    fillColor: "#349beb",
    fillOpacity: 100,
    strokeColor: "#000000",
    strokeOpacity: 100,
    size: 15,
    shape: ["circle", "square"],
    mirror: false,
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
    mirror,
  }) => {
    const stroke = s.color(strokeColor);
    stroke.setAlpha(strokeOpacity);

    const fill = s.color(fillColor);
    fill.setAlpha(fillOpacity);

    s.stroke(stroke);
    s.fill(fill);

    s.renderShape(x, y, size, shape, mirror);
  };

  s.renderShape = (x, y, size, shape, mirror) => {
    switch (shape) {
      case "circle":
        s.handleMirrorMode(s.circle.bind(s), x, y, size, mirror);
        break;
      case "square":
        s.handleMirrorMode(s.square.bind(s), x, y, size, mirror);
        break;
    }
  };

  s.handleMirrorMode = (shape, x, y, size, mirror) => {
    shape(x, y, size);
    if (mirror) {
      shape(s.windowWidth - x, s.windowHeight - y, size);
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
      mirror: guiParams.mirror,
    };

    s.updateDrawing(paintProperties);
    socket.emit("update", paintProperties);
  };

  s.windowResized = () => {
    s.resizeCanvas(s.windowWidth, s.windowHeight);
  };
};

new p5(app);
