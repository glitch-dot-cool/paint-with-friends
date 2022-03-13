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
import { Camera } from "./utils/Camera.js";

const app = (s) => {
  const keysPressed = new KeyManager(s);
  let socket, canvas, camera;

  s.initCanvas = (serializedCanvas) => {
    canvas = document.querySelector("canvas");
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
    camera = new Camera(canvas);

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

  s.initLastCoords = () => {
    if (!state.lastX || !state.lastY) {
      s.setLastCoords();
    }
  };

  s.setLastCoords = () => {
    state.lastX = Camera.scaleByZoomAmount(s.mouseX, camera.zoomAmount);
    state.lastY = Camera.scaleByZoomAmount(s.mouseY, camera.zoomAmount);
  };

  s.mouseDragged = ({ movementX, movementY }) => {
    if (state.isDrawing) {
      s.initLastCoords();
      const paintProperties = setupPaintProperties(s, state, camera.zoomAmount);
      updateDrawing(s, paintProperties);
      socket.emit(
        EVENTS.DRAW_UPDATE,
        convertToLeanPaintProperties(paintProperties)
      );
      s.setLastCoords();
    } else {
      camera.pan(movementX, movementY);
    }
  };

  s.mouseWheel = ({ delta }) => {
    camera.set(delta * -1);
    camera.zoom();
  };

  s.keyPressed = () => {
    keysPressed.addKey(s.keyCode);
  };

  s.keyReleased = () => {
    keysPressed.removeKey(s.keyCode);
  };

  s.mousePressed = () => {
    if (!state.isDrawing) document.body.style.cursor = "grabbing";
  };

  s.mouseReleased = () => {
    if (!state.isDrawing) document.body.style.cursor = "grab";

    // reset last coord positions to null to re-trigger init
    state.lastX = state.lastY = null;
    console.log(state.lastX, state.lastY);
  };
};

new p5(app);
