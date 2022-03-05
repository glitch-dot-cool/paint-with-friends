import { Waveforms } from "./Waveforms.js";
import { paintProperties as p } from "../constants.js";

export const setupPaintProperties = (p5, state, lastX, lastY) => {
  const { gui } = state;
  const lfo1 = useLfo(p5, state.gui, state.lfo1);
  const lfo2 = useLfo(p5, state.gui, state.lfo2);
  const lfo3 = useLfo(p5, state.gui, state.lfo3);
  // pack lfos in reverse order so subsequent LFOs override previous ones
  const lfos = [lfo3, lfo2, lfo1];

  return {
    x: handleLfoValue(p5, lfos, gui, p.X),
    y: handleLfoValue(p5, lfos, gui, p.Y),
    fillColor: handleLfoValue(p5, lfos, gui, p.FILL_COLOR),
    strokeColor: handleLfoValue(p5, lfos, gui, p.STROKE_COLOR),
    size: handleLfoValue(p5, lfos, gui, p.SIZE),
    fillOpacity: handleLfoValue(p5, lfos, gui, p.FILL_OPACITY),
    strokeOpacity: handleLfoValue(p5, lfos, gui, p.STROKE_OPACITY),
    shape: gui.shape,
    mirrorX: gui.mirrorX,
    mirrorY: gui.mirrorY,
    prevX: lastX,
    prevY: lastY,
    strokeWeight: handleLfoValue(p5, lfos, gui, p.STROKE_WEIGHT),
  };
};

// default to the values from the GUI if no LFO stuff is enabled
// if any are enabled, they will be overwritten by their LFO'd values
const handleLfoValue = (p5, lfos, gui, value) => {
  let lfoCount = 0;
  let runningValue = 0;
  let isColor = false;
  let colorsArray = [0, 0, 0];

  for (const lfo of lfos) {
    if (lfo[value]) {
      lfoCount++;

      // if we're dealing with a color
      if ([p.FILL_COLOR, p.STROKE_COLOR].includes(value)) {
        isColor = true;
        const levels = lfo[value].levels;

        // sum rgb values from lfos
        for (let i = 0; i < 3; i++) {
          colorsArray[i] += levels[i];
        }

        colorsArray = colorsArray.map((colorChannel) =>
          p5.map(colorChannel, 0, 255 * lfoCount, 0, 255)
        );
      } else {
        runningValue += lfo[value];
      }
    }
  }

  // if a color, return a hex string
  if (isColor) return p5.color(colorsArray).toString("#rrggbb");

  // otherwise return the value as a number (default to GUI if no active lfo for given param)
  return lfoCount > 0 ? runningValue / lfoCount : gui[value];
};

export const useLfo = (p5, gui, lfo) => {
  const {
    speed,
    amount,
    shape,
    fillOpacity,
    strokeOpacity,
    size,
    fillColor,
    strokeColor,
    floor,
    x,
    y,
    strokeWeight,
  } = lfo.gui;

  // x & y don't have default values from GUI, so prepopulate w/ current mouse X/Y
  const values = {
    x: p5.mouseX,
    y: p5.mouseY,
  };

  // if any of the LFO targetable params are enabled, advance the lfo
  if (
    fillOpacity ||
    strokeOpacity ||
    size ||
    fillColor ||
    strokeColor ||
    x ||
    y ||
    strokeWeight
  ) {
    lfo.value += speed;
    // up to 2 * PI (see Waveforms.js implementation)
    lfo.value %= Math.PI * 2;
  }

  if (x) {
    const lfoValue =
      p5.mouseX + (Waveforms[shape](floor, lfo.value) * 2 - 1) * amount;

    values[p.X] = lfoValue;
  }

  if (y) {
    const lfoValue =
      p5.mouseY + (Waveforms[shape](floor, lfo.value) * 2 - 1) * amount;

    values[p.Y] = lfoValue;
  }

  if (fillOpacity) {
    // scale color values by 2.55x: 100 * 2.55 = 255
    const lfoValue =
      gui.fillOpacity + Waveforms[shape](floor, lfo.value) * (amount * 2.55);

    const scaledValue = scaleLfoValue(p5, lfoValue, gui.fillOpacity, 0, 255);

    values[p.FILL_OPACITY] = scaledValue;
  }

  if (fillColor) {
    // scale amount to 360 (degrees) for rotating through HSL colorspace
    const lfoValue = Waveforms[shape](floor, lfo.value) * (amount * 3.6);
    const rainbow = useRainbow(p5, lfoValue, lfo.gui, values.fillOpacity);
    values[p.FILL_COLOR] = rainbow;
  }

  if (strokeOpacity) {
    const lfoValue =
      gui.strokeOpacity + Waveforms[shape](floor, lfo.value) * (amount * 2.55);

    const scaledValue = scaleLfoValue(p5, lfoValue, gui.strokeOpacity, 0, 255);

    values[p.STROKE_OPACITY] = scaledValue;
  }

  if (strokeColor) {
    const lfoValue = Waveforms[shape](floor, lfo.value) * (amount * 3.6);
    const rainbow = useRainbow(p5, lfoValue, lfo.gui, values.strokeOpacity);
    values[p.STROKE_COLOR] = rainbow;
  }

  if (size) {
    values[p.SIZE] = gui.size + Waveforms[shape](floor, lfo.value) * amount;
  }

  if (strokeWeight) {
    values[p.STROKE_WEIGHT] =
      gui.strokeWeight + Waveforms[shape](floor, lfo.value) * amount;
  }

  return values;
};

// this function handles bias/offset from GUI-derived values applied to the LFO
// note: this function does not work w/ colors, just raw numbers
const scaleLfoValue = (p5, lfoValue, guiValue, min, max) => {
  return p5.map(lfoValue, -max + guiValue, max + guiValue, min, max);
};

const useRainbow = (p5, lfoValue, lfoGui, opacity) => {
  const hue = Math.floor(lfoValue);
  const saturation = lfoGui.saturation;
  const brightness = lfoGui.brightness;

  const rainbow = p5.color(`hsb(${hue}, ${saturation}%, ${brightness}%)`);
  rainbow.setAlpha(Math.ceil(opacity));

  return rainbow;
};

/**
 * Converts paint properties object to an ordered array to reduce payload size.
 *
 * @param {object} paintProperties
 * @returns {array} leanPaintProperties
 */
export const convertToLeanPaintProperties = (paintProperties) => {
  return [
    paintProperties.x,
    paintProperties.y,
    paintProperties.fillColor,
    paintProperties.fillOpacity,
    paintProperties.strokeColor,
    paintProperties.strokeOpacity,
    paintProperties.mirrorX,
    paintProperties.mirrorY,
    paintProperties.shape,
    paintProperties.size,
    paintProperties.prevX,
    paintProperties.prevY,
    paintProperties.strokeWeight,
  ];
};

/**
 * Converts "lean" (array) representation of paint properties back to the object
 * shape used within the client/server p5 applications.
 *
 * @param {array} leanPaintProperties
 * @returns {object} paintProperties
 */
export const convertLeanPaintPropertiesToObject = (leanPaintProperties) => {
  return {
    x: leanPaintProperties[0],
    y: leanPaintProperties[1],
    fillColor: leanPaintProperties[2],
    fillOpacity: leanPaintProperties[3],
    strokeColor: leanPaintProperties[4],
    strokeOpacity: leanPaintProperties[5],
    mirrorX: leanPaintProperties[6],
    mirrorY: leanPaintProperties[7],
    shape: leanPaintProperties[8],
    size: leanPaintProperties[9],
    prevX: leanPaintProperties[10],
    prevY: leanPaintProperties[11],
    strokeWeight: leanPaintProperties[12],
  };
};
