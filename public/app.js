const app = (s) => {
  const socket = io.connect("http://localhost:3000");
  const guiParams = {
    fillColor: "#349beb",
    fillOpacity: 100,
    strokeColor: "#000000",
    strokeOpacity: 100,
    size: 15,
  };

  s.setup = function () {
    s.createCanvas(s.windowWidth, s.windowHeight);
    s.background(0);
    const gui = s.createGui(this);
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
  }) => {
    const stroke = s.color(strokeColor);
    stroke.setAlpha(strokeOpacity);

    const fill = s.color(fillColor);
    fill.setAlpha(fillOpacity);

    s.stroke(stroke);
    s.fill(fill);

    s.circle(x, y, size);
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
    };

    s.updateDrawing(paintProperties);
    socket.emit("update", paintProperties);
  };

  s.windowResized = () => {
    s.resizeCanvas(s.windowWidth, s.windowHeight);
  };
};

new p5(app);
