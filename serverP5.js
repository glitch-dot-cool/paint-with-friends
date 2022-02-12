import p5 from "node-p5";

import { dimensions } from "./public/src/constants.js";
import { updateDrawing } from "./public/src/utils/drawing.js";
import { initialServerState } from "./public/src/initialState.js";
import { eventEmitter } from "./event.js";
import { EVENTS } from "./public/src/constants.js";

export const initServerP5 = () => {
  let paintProperties = initialServerState;
  let canvas;

  function sketch(s) {
    eventEmitter.on(EVENTS.DRAW_UPDATE, (data) => {
      paintProperties = data;
      updateDrawing(s, paintProperties);
    });

    s.setup = () => {
      canvas = s.createCanvas(dimensions.width, dimensions.height);
      s.background(0);
      s.rectMode(s.CENTER);
    };
  }

  p5.createSketch(sketch);

  function serializeCanvas() {
    return canvas.elt.toDataURL("image/png", 1);
  }

  return serializeCanvas;
};
