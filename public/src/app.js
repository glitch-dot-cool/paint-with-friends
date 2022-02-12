import { state } from "./initialState.js";
import { dimensions, EVENTS } from "./constants.js";
import { setupPaintProperties } from "./utils/setupPaintProperties.js";
import { updateDrawing } from "./utils/drawing.js";
import { LocalStorage } from "./utils/LocalStorage.js";
import { Fetch } from "./utils/Fetch.js";
import { userList } from "./components/userList.js";
import { initUsername } from "./utils/initUsername.js";
import { chatMessages } from "./components/chatMessages.js";
import { KeyManager } from "./utils/KeyManager.js";

const app = (s) => {
  const keysPressed = new KeyManager(s);
  const GUI_WIDTH = 200;
  const GUI_GUTTER = 20;
  const GUI_OFFSET = 0 + 2 * GUI_GUTTER + GUI_WIDTH;

  let socket;

  s.initCanvas = (serializedCanvas) => {
    const canvas = document.querySelector("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = function () {
      ctx.drawImage(img, 0, 0);
    };
    img.src = serializedCanvas;
  };

  s.setup = async function () {
    const initialCanvasState = await Fetch.get("canvas");
    s.createCanvas(dimensions.width, dimensions.height);
    s.initCanvas(initialCanvasState);
    s.background(0);
    s.rectMode(s.CENTER);

    socket = io.connect("http://localhost:3000");

    const gui = s.createGui("paintbrush", this);
    gui.id = "paintbrush-options";
    gui.addObject(state.gui);

    const lfo1Gui = s.createGui("lfo1", this);
    lfo1Gui.setPosition(GUI_OFFSET);
    lfo1Gui.addObject(state.lfo1.gui);
    lfo1Gui.collapse();

    const lfo2Gui = s.createGui("lfo2", this);
    lfo2Gui.setPosition(2 * GUI_OFFSET - GUI_GUTTER);
    lfo2Gui.addObject(state.lfo2.gui);
    lfo2Gui.collapse();

    const lfo3Gui = s.createGui("lfo3", this);
    lfo3Gui.setPosition(3 * GUI_OFFSET - 2 * GUI_GUTTER);
    lfo3Gui.addObject(state.lfo3.gui);
    lfo3Gui.collapse();

    socket.on(EVENTS.CONNECTED, (socketID) => {
      LocalStorage.set("pwf_socket", socketID);
      initUsername(socketID);
    });

    socket.on(EVENTS.DRAW_UPDATE, (paintProperties) => {
      updateDrawing(s, paintProperties);
    });

    socket.on(EVENTS.MEMBERS_CHANGED, (users) => {
      userList(users);
    });

    socket.on(EVENTS.MESSAGE, (message) => {
      chatMessages(message);
    });
  };

  s.mouseDragged = () => {
    const paintProperties = setupPaintProperties(s, state);
    updateDrawing(s, paintProperties);
    socket.emit(EVENTS.DRAW_UPDATE, paintProperties);
  };

  s.keyPressed = () => {
    keysPressed.addKey(s.keyCode);
  };

  s.keyReleased = () => {
    keysPressed.removeKey(s.keyCode);
  };
};

new p5(app);
