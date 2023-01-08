import { state } from "./initialState.js";
import { dimensions, EVENTS } from "./constants.js";
import {
  setupPaintProperties,
  convertToLeanPaintProperties,
  convertLeanPaintPropertiesToObject,
} from "./utils/setupPaintProperties.js";
import {
  getFrameRate,
  getFrametime,
  throttle,
  toggleCursor,
  updateDrawing,
} from "./utils/drawing.js";
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
import { Socket } from "socket.io";
import {
  Connections,
  DrawUpdate,
  LeanDrawUpdate,
  PaintWithFriends,
} from "../../types";

const app = (s: PaintWithFriends) => {
  const keysPressed = new KeyManager(s);
  let socket: Socket,
    canvas: HTMLCanvasElement,
    font: p5.Font,
    throttleRate = 0.01666666666666666666666666666667; // 60fps frametime ;

  s.preload = () => {
    Loader.show();
    font = s.loadFont("assets/JetBrainsMonoLight.ttf");
  };

  s.initCanvas = (serializedCanvas: string) => {
    const canvasElement = document.querySelector<HTMLCanvasElement>("#app");
    if (canvasElement) canvas = canvasElement;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = function () {
      ctx?.drawImage(img, 0, 0);
    };
    img.src = serializedCanvas;
  };

  s.setup = async function () {
    const initialCanvasState = await Fetch.get("canvas");
    const cnv = s.createCanvas(dimensions.width, dimensions.height);
    cnv.id("app");
    s.initCanvas(initialCanvasState);
    camera.registerCanvas(canvas, "app");

    s.textFont(font);
    s.rectMode(s.CENTER);

    // @ts-ignore - imported via script tag in paint.html
    socket = io.connect(setBaseUrl());

    initGuiPanels(s);

    // init separate sketch for rendering cursors
    new p5(initCursors(socket, camera));
    Loader.hide();

    socket.on(EVENTS.CONNECTED, (socketID) => {
      LocalStorage.set("pwf_socket", socketID);
      initUsername(socketID);
    });

    socket.on(EVENTS.DRAW_UPDATE, (leanPaintProperties: LeanDrawUpdate) => {
      const paintProperties: DrawUpdate =
        convertLeanPaintPropertiesToObject(leanPaintProperties);

      updateDrawing(s, paintProperties);
    });

    socket.on(EVENTS.MEMBERS_CHANGED, (users: Connections) => {
      userList(users);
      s.updateThrottleRate(users);
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
    throttle(() => {
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
    }, throttleRate);
  };

  s.mouseDragged = ({
    movementX,
    movementY,
  }: {
    movementX: number;
    movementY: number;
  }) => {
    if (state.isDrawing) {
      s.paint();
    } else {
      camera.pan(movementX, movementY);
    }
  };

  s.mouseWheel = ({ deltaY }: WheelEvent) => {
    camera.zoom(deltaY);
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

    // reset last coord positions to re-trigger init
    state.lastX = state.lastY = 0;
  };

  s.updateThrottleRate = (connections: Connections) => {
    const numUsersDrawing = Object.values(connections).filter(
      (c) => c.isPainting
    ).length;

    throttleRate = getFrametime(numUsersDrawing);
  };
};

new p5(app);
