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
import { initGuiPanels } from "./utils/initUI.js";
import { setBaseUrl } from "./utils/setBaseUrl.js";

const app = (s) => {
  const keysPressed = new KeyManager(s);
  let socket, canvas;
  let zoom = 1;
  let isDrawing = false;

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

    s.background(0);
    s.rectMode(s.CENTER);

    socket = io.connect(setBaseUrl());

    initGuiPanels(s, this);

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
    if (isDrawing) {
      const paintProperties = setupPaintProperties(s, state);
      updateDrawing(s, paintProperties);
      socket.emit(EVENTS.DRAW_UPDATE, paintProperties);
    } else {
      s.scaleAt(s.mouseX, s.mouseY, zoom);
    }
  };

  const origin = { x: 0, y: 0 };

  s.scaleAt = (x, y, zoom) => {
    origin.x = x - (x - origin.x) * zoom;
    origin.y = y - (y - origin.y) * zoom;
    console.log(zoom, origin.x, origin.y);
    canvas.style.transform = `scale(${zoom}) translate(${origin.x}px, ${origin.y}px)`;
  };

  s.mouseWheel = ({ delta }) => {
    console.log("scrolling");
    zoom += delta * -1 * 0.001;
    s.scaleAt(s.mouseX, s.mouseY, zoom);
  };

  s.keyPressed = () => {
    keysPressed.addKey(s.keyCode);
    if (s.keyCode === 16) isDrawing = true;
  };

  s.keyReleased = () => {
    keysPressed.removeKey(s.keyCode);
    if (s.keyCode === 16) isDrawing = false;
  };
};

new p5(app);
