import p5 from "node-p5";

import { dimensions } from "./public/src/constants.js";
import { updateDrawing } from "./public/src/utils/drawing.js";
import { initialServerState } from "./public/src/initialState.js";
import { eventEmitter } from "./event.js";
import { EVENTS } from "./public/src/constants.js";
import { convertLeanPaintPropertiesToObject } from "./public/src/utils/setupPaintProperties.js";
import { DrawUpdate } from "./public/src/types/websocket.js";

export const initServerP5 = () => {
  let paintProperties = initialServerState as DrawUpdate;

  let canvas: p5.canvas | undefined;
  const typeface = p5.loadFont({
    path: "public/assets/JetBrainsMonoLight.ttf",
    family: "JetBrainsMono",
  });

  function sketch(s: p5) {
    eventEmitter.on(EVENTS.DRAW_UPDATE, (data) => {
      paintProperties = convertLeanPaintPropertiesToObject(data);
      updateDrawing(s, paintProperties);
    });

    s.setup = () => {
      canvas = s.createCanvas(dimensions.width, dimensions.height);
      s.background(0);
      s.rectMode(s.CENTER);
      s.textFont(typeface);
    };
  }

  p5.createSketch(sketch);

  function serializeCanvas(quality = 1) {
    return canvas?.elt.toDataURL("image/png", quality);
  }

  return serializeCanvas;
};
