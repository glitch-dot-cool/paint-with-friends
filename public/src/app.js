import { state } from "./initialState.js";
import { dimensions } from "./constants.js";
import { setupPaintProperties } from "./utils/setupPaintProperties.js";
import { updateDrawing } from "./utils/drawing.js";

const app = (s) => {
  const socket = io.connect("http://localhost:3000");

  s.setup = function () {
    s.createCanvas(dimensions.width, dimensions.height); // 1080p-friendly
    s.background(0);
    s.rectMode(s.CENTER);

    const gui = s.createGui("paintbrush options", this);
    gui.addObject(state.gui);

    const lfoGui = s.createGui("lfo options", this);
    lfoGui.setPosition(s.windowWidth - 240, 20);
    lfoGui.addObject(state.lfo);

    socket.on("update", (paintProperties) => {
      updateDrawing(s, paintProperties);
    });
  };

  s.mouseDragged = () => {
    const paintProperties = setupPaintProperties(s, state);
    updateDrawing(s, paintProperties);
    socket.emit("update", paintProperties);
  };

  s.keyPressed = () => {
    // p key
    if (s.keyCode === 80) {
      s.save("paint with friends.png", false); // false prevents canvas from being cleared
    }
  };
};

new p5(app);