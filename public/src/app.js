import { state } from "./initialState.js";
import { dimensions } from "./constants.js";
import { setupPaintProperties } from "./utils/setupPaintProperties.js";
import { updateDrawing } from "./utils/drawing.js";
import { LocalStorage } from "./utils/LocalStorage.js";
import { userList } from "./components/userList.js";
import { initUsername } from "./utils/initUsername.js";
import { chatMessages } from "./components/chatMessages.js";
import { KeyManager } from "./utils/KeyManager.js";

const app = (s) => {
  const socket = io.connect("http://localhost:3000");
  const keysPressed = new KeyManager(s);

  s.setup = function () {
    s.createCanvas(dimensions.width, dimensions.height);
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

    socket.on("connected", (socketID) => {
      LocalStorage.set("pwf_socket", socketID);
      initUsername(socketID);

      socket.on("update", (paintProperties) => {
        updateDrawing(s, paintProperties);
      });

      socket.on("members", (users) => {
        userList(users);
      });

      socket.on("message", (message) => {
        chatMessages(message);
      });
    });
  };

  s.mouseDragged = () => {
    const paintProperties = setupPaintProperties(s, state);
    updateDrawing(s, paintProperties);
    socket.emit("update", paintProperties);
  };

  s.keyPressed = () => {
    keysPressed.addKey(s.keyCode);
  };

  s.keyReleased = () => {
    keysPressed.removeKey(s.keyCode);
  };
};

new p5(app);
