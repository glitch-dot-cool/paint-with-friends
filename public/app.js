const app = (s) => {
  const socket = io.connect("http://localhost:3000");

  s.setup = () => {
    s.createCanvas(s.windowWidth, s.windowHeight);
    s.background(0);

    socket.on("mouseMoved", ({ x, y }) => {
      s.updateDrawing(x, y, s.color(255, 0, 40));
    });
  };

  s.updateDrawing = (x, y, color) => {
    s.fill(color);
    s.circle(x, y, 20);
  };

  s.mouseDragged = () => {
    s.updateDrawing(s.mouseX, s.mouseY, s.color(40, 0, 255));

    const mouseCoords = {
      x: s.mouseX,
      y: s.mouseY,
    };
    socket.emit("mouseMoved", mouseCoords);
  };

  s.windowResized = () => {
    s.resizeCanvas(s.windowWidth, s.windowHeight);
  };
};

new p5(app);
