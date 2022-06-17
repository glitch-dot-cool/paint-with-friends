import { Waveforms } from "./Waveforms.js";
import { paintProperties as p } from "../constants.js";
import { Camera } from "./Camera.js";
import { state } from "../initialState.js";

const cache = {};

const getLfoTargetDOMNode = (target, inputOrLabel) => {
  if (!cache[target]) {
    cache[target] = document.querySelector(`#${target} ${inputOrLabel}`);
    return cache[target];
  } else return cache[target];
};

export const setupPaintProperties = (p5, state, zoomAmount) => {
  const { gui } = state;
  const lfo1 = useLfo(p5, state.gui, state.lfo1);
  const lfo2 = useLfo(p5, state.gui, state.lfo2);
  const lfo3 = useLfo(p5, state.gui, state.lfo3);
  // pack lfos in reverse order so subsequent LFOs override previous ones
  const lfos = [lfo3, lfo2, lfo1];

  return {
    x: Camera.scaleByZoomAmount(handleLfoValue(p5, lfos, gui, p.X), zoomAmount),
    y: Camera.scaleByZoomAmount(handleLfoValue(p5, lfos, gui, p.Y), zoomAmount),
    fillColor: handleLfoValue(p5, lfos, gui, p.FILL_COLOR),
    strokeColor: handleLfoValue(p5, lfos, gui, p.STROKE_COLOR),
    size: handleLfoValue(p5, lfos, gui, p.SIZE),
    fillOpacity: handleLfoValue(p5, lfos, gui, p.FILL_OPACITY),
    strokeOpacity: handleLfoValue(p5, lfos, gui, p.STROKE_OPACITY),
    shape: gui.shape,
    mirrorX: gui.mirrorX,
    mirrorY: gui.mirrorY,
    prevX: state.lastX,
    prevY: state.lastY,
    strokeWeight: handleLfoValue(p5, lfos, gui, p.STROKE_WEIGHT),
    saturation: handleLfoValue(p5, lfos, gui, p.SATURATION),
    brightness: handleLfoValue(p5, lfos, gui, p.BRIGHTNESS),
    text: gui.text,
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
    saturation,
    brightness,
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
    strokeWeight ||
    saturation ||
    brightness
  ) {
    lfo.value += speed;
  }

  if (x) {
    p5.mouseX + (Waveforms[shape](floor, lfo.value) * 2 - 1) * amount;
  }

  if (y) {
    values[p.Y] =
      p5.mouseY + (Waveforms[shape](floor, lfo.value) * 2 - 1) * amount;
  }

  if (saturation) {
    const lfoValue = Waveforms[shape](floor, lfo.value) * amount;
    values[p.SATURATION] = lfoValue;
    const input = getLfoTargetDOMNode(p.SATURATION, "input");
    input.value = lfoValue;
  }

  if (brightness) {
    const lfoValue = Waveforms[shape](floor, lfo.value) * amount;
    values[p.BRIGHTNESS] = lfoValue;
    const input = getLfoTargetDOMNode(p.BRIGHTNESS, "input");
    input.value = lfoValue;
  }

  if (fillOpacity) {
    // scale color values by 2.55x: 100 * 2.55 = 255
    const lfoValue = Waveforms[shape](floor, lfo.value) * (amount * 2.55);
    values[p.FILL_OPACITY] = lfoValue;
    const input = getLfoTargetDOMNode(p.FILL_OPACITY, "input");
    input.value = lfoValue;
  }

  if (fillColor) {
    // scale amount to 360 (degrees) for rotating through HSL colorspace
    const lfoValue = Waveforms[shape](floor, lfo.value) * (amount * 3.6);
    const rainbow = useRainbow(p5, lfoValue);
    values[p.FILL_COLOR] = rainbow;
    const label = getLfoTargetDOMNode(p.FILL_COLOR, "label");
    label.style.backgroundColor = rainbow;
  }

  if (strokeOpacity) {
    const lfoValue = Waveforms[shape](floor, lfo.value) * (amount * 2.55);
    values[p.STROKE_OPACITY] = lfoValue;
    const input = getLfoTargetDOMNode(p.STROKE_OPACITY, "input");
    input.value = lfoValue;
  }

  if (strokeColor) {
    const lfoValue = Waveforms[shape](floor, lfo.value) * (amount * 3.6);
    const rainbow = useRainbow(p5, lfoValue);
    values[p.STROKE_COLOR] = rainbow;
    const label = getLfoTargetDOMNode(p.STROKE_COLOR, "label");
    label.style.backgroundColor = rainbow;
  }

  if (size) {
    const value =
      Waveforms[shape](floor, lfo.value) *
      ((amount * state.gui.sizeMax) / amount);
    values[p.SIZE] = value;
    const input = getLfoTargetDOMNode(p.SIZE, "input");
    input.value = value;
  }

  if (strokeWeight) {
    const value = Waveforms[shape](floor, lfo.value) * amount;
    values[p.STROKE_WEIGHT] = value;
    const input = getLfoTargetDOMNode(p.STROKE_WEIGHT, "input");
    input.value = value;
  }

  return values;
};

const useRainbow = (p5, lfoValue) => {
  const hue = Math.floor(lfoValue);
  // saturation & brightness will be overridden by global paintbrush setting
  return p5.color(`hsb(${hue}, 100%, 100%)`);
};

/**
 * Converts paint properties object to an ordered array to reduce payload size.
 *
 * @param {object} paintProperties
 * @returns {array} leanPaintProperties
 */
export const convertToLeanPaintProperties = (paintProperties, username) => {
  return [
    username,
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
    paintProperties.saturation,
    paintProperties.brightness,
    paintProperties.text,
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
    x: leanPaintProperties[1],
    y: leanPaintProperties[2],
    fillColor: leanPaintProperties[3],
    fillOpacity: leanPaintProperties[4],
    strokeColor: leanPaintProperties[5],
    strokeOpacity: leanPaintProperties[6],
    mirrorX: leanPaintProperties[7],
    mirrorY: leanPaintProperties[8],
    shape: leanPaintProperties[9],
    size: leanPaintProperties[10],
    prevX: leanPaintProperties[11],
    prevY: leanPaintProperties[12],
    strokeWeight: leanPaintProperties[13],
    saturation: leanPaintProperties[14],
    brightness: leanPaintProperties[15],
    text: leanPaintProperties[16],
  };
};
