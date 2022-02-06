import p5 from "node-p5";

import { dimensions } from "./public/src/constants.js";
import { updateDrawing } from "./public/src/utils/drawing.js";
import { initialServerState } from "./public/src/initialState.js";
import { eventEmitter, EVENTS } from "./event.js";

export const initServerP5 = () => {
  let paintProperties = initialServerState;
  let count = 0;

  function sketch(s) {
    let canvas;

    eventEmitter.on(EVENTS.DRAW_UPDATE, (data) => {
      paintProperties = data;
      updateDrawing(s, paintProperties);
    });

    s.setup = () => {
      canvas = s.createCanvas(dimensions.width, dimensions.height);
      s.background(0);
      s.rectMode(s.CENTER);
    };

    s.draw = () => {
      if (s.frameCount % 1000 === 0) {
        count++;
        s.saveCanvas(canvas, `canvas_${count}`, "png").then((filename) => {
          console.log(`saved the canvas as ${filename}`);
        });
      }
    };
  }

  p5.createSketch(sketch);
};
