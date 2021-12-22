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

    const gui = s.createGui("paintbrush", this);
    gui.addObject(state.gui);

    const lfo1Gui = s.createGui("lfo1", this);
    lfo1Gui.setPosition(s.windowWidth - 240, 20);
    lfo1Gui.addObject(state.lfo1.gui);

    const lfo2Gui = s.createGui("lfo2", this);
    lfo2Gui.setPosition(s.windowWidth - 240, 380);
    lfo2Gui.addObject(state.lfo2.gui);
    lfo2Gui.collapse();

    const lfo3Gui = s.createGui("lfo3", this);
    lfo3Gui.setPosition(s.windowWidth - 240, 420);
    lfo3Gui.addObject(state.lfo3.gui);
    lfo3Gui.collapse();

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
