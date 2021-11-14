const app = (s) => {
  const socket = io.connect("http://localhost:3000");

  s.setup = () => {
    s.createCanvas(s.windowWidth, s.windowHeight);
    s.background(0);
  };

  s.mouseDragged = () => {
    s.fill(40, 0, 255);
    s.circle(s.mouseX, s.mouseY, 20);
  };

  s.windowResized = () => {
    s.resizeCanvas(s.windowWidth, s.windowHeight);
  };
};

new p5(app);
