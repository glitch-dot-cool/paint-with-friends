import { state } from "./initialState.js";
import { dimensions, EVENTS } from "./constants.js";
import {
  setupPaintProperties,
  convertToLeanPaintProperties,
  convertLeanPaintPropertiesToObject,
} from "./utils/setupPaintProperties.js";
import { updateDrawing } from "./utils/drawing.js";
import { LocalStorage } from "./utils/LocalStorage.js";
import { Fetch } from "./utils/Fetch.js";
import { userList } from "./components/userList.js";
import { initUsername } from "./utils/initUsername.js";
import { chatMessages } from "./components/chatMessages.js";
import { KeyManager } from "./utils/KeyManager.js";
import { initGuiPanels } from "./utils/initUI.js";
import { setBaseUrl } from "./utils/setBaseUrl.js";

const app = (s) => {
  const keysPressed = new KeyManager(s);
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

    socket = io.connect(setBaseUrl());

    initGuiPanels(s, this);

    socket.on(EVENTS.CONNECTED, (socketID) => {
      LocalStorage.set("pwf_socket", socketID);
      initUsername(socketID);
    });

    socket.on(EVENTS.DRAW_UPDATE, (leanPaintProperties) => {
      const paintProperties =
        convertLeanPaintPropertiesToObject(leanPaintProperties);

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

    socket.emit(
      EVENTS.DRAW_UPDATE,
      convertToLeanPaintProperties(paintProperties)
    );
  };

  s.keyPressed = () => {
    keysPressed.addKey(s.keyCode);
  };

  s.keyReleased = () => {
    keysPressed.removeKey(s.keyCode);
  };
};

new p5(app);
