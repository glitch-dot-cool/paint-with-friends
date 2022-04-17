import { state } from "./initialState.js";
import { dimensions, EVENTS } from "./constants.js";
import {
  setupPaintProperties,
  convertToLeanPaintProperties,
  convertLeanPaintPropertiesToObject,
} from "./utils/setupPaintProperties.js";
import { toggleCursor, updateDrawing } from "./utils/drawing.js";
import { LocalStorage } from "./utils/LocalStorage.js";
import { Fetch } from "./utils/Fetch.js";
import { userList } from "./components/userList.js";
import { initUsername } from "./utils/initUsername.js";
import { chatMessages } from "./components/chatMessages.js";
import { KeyManager } from "./utils/KeyManager.js";
import { initGuiPanels } from "./utils/initUI.js";
import { setBaseUrl } from "./utils/setBaseUrl.js";
import { Camera, camera } from "./utils/Camera.js";
import { initCursors } from "./cursors.js";
import { Loader } from "./components/loader.js";

const app = (s) => {
  const keysPressed = new KeyManager(s);
  let socket, canvas;

  s.initCanvas = (serializedCanvas) => {
    canvas = document.querySelector("#app");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = function () {
      ctx.drawImage(img, 0, 0);
    };
    img.src = serializedCanvas;
  };

  s.setup = async function () {
    Loader.show();
    const initialCanvasState = await Fetch.get("canvas");
    const cnv = s.createCanvas(dimensions.width, dimensions.height);
    cnv.id("app");
    s.initCanvas(initialCanvasState);
    camera.registerCanvas(canvas, "app");

    s.rectMode(s.CENTER);

    socket = io.connect(setBaseUrl());

    initGuiPanels(s, this);

    // init separate sketch for rendering cursors
    new p5(initCursors(socket, camera));
    Loader.hide();

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

    socket.on(EVENTS.MESSAGE, (messages) => {
      if (!state.hasInitializedMessages) {
        chatMessages(messages, true);
        state.hasInitializedMessages = true;
      } else chatMessages(messages);
    });
  };

  s.draw = () => {
    if (s.keyIsDown(32) && state.isDrawing) {
      state.isDrawing = false;
      toggleCursor(state);
    }
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

  s.keyPressed = () => {
    keysPressed.addKey(s.keyCode);
  };

  s.keyReleased = () => {
    keysPressed.removeKey(s.keyCode);
    if (!s.keyIsPressed) keysPressed.purge();

    // release drag mode
    if (s.keyCode === 32) {
      if (!state.isDrawing) {
        state.isDrawing = true;
        toggleCursor(state);
      }
    }
  };

  s.paint = () => {
    s.initLastCoords();
    const paintProperties = setupPaintProperties(s, state, camera.zoomAmount);
    updateDrawing(s, paintProperties);
    socket.emit(
      EVENTS.DRAW_UPDATE,
      convertToLeanPaintProperties(
        paintProperties,
        LocalStorage.get("pwf_username") || LocalStorage.get("pwf_socket")
      )
    );
    s.setLastCoords();
  };

  s.mouseDragged = ({ movementX, movementY }) => {
    if (state.isDrawing) {
      s.paint();
    } else {
      camera.pan(movementX, movementY);
    }
  };

  s.mouseWheel = ({ delta }) => {
    camera.zoom(delta);
  };

  s.mousePressed = () => {
    if (state.isDrawing) {
      s.paint();
    } else {
      document.body.style.cursor = "grabbing";
    }
  };

  s.mouseReleased = () => {
    if (!state.isDrawing) {
      document.body.style.cursor = "grab";
    } else {
      // if done drawing, clear the cursors
      socket.emit(
        EVENTS.MOUSE_RELEASED,
        LocalStorage.get("pwf_username") || LocalStorage.get("pwf_socket")
      );
    }

    // reset last coord positions to null to re-trigger init
    state.lastX = state.lastY = null;
  };
};

new p5(app);
