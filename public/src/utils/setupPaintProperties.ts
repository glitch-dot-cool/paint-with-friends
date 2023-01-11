import { Waveforms } from "./Waveforms.js";
import { Camera } from "./Camera.js";
import { state } from "../initialState.js";
import {
  DrawUpdate,
  GuiValues,
  Lfo,
  LfoTarget,
  Paintbrush,
  State,
} from "../../../types";
import { EVENTS, paintProperties as p } from "../constants.js";
import { domElements } from "../ui.js";

export const setupPaintProperties = (
  p5: p5,
  state: State,
  zoomAmount: number
): DrawUpdate => {
  const { gui } = state;
  const lfo1 = useLfo(p5, state.gui, state.lfo1);
  const lfo2 = useLfo(p5, state.gui, state.lfo2);
  const lfo3 = useLfo(p5, state.gui, state.lfo3);
  // pack lfos in reverse order so subsequent LFOs override previous ones
  const lfos = [lfo3, lfo2, lfo1];

  return {
    x: Camera.scaleByZoomAmount(getLfoValue(lfos, gui, "x"), zoomAmount),
    y: Camera.scaleByZoomAmount(getLfoValue(lfos, gui, "y"), zoomAmount),
    fillHue: getLfoValue(lfos, gui, "fillHue"),
    strokeHue: getLfoValue(lfos, gui, "strokeHue"),
    size: getLfoValue(lfos, gui, "size"),
    fillOpacity: getLfoValue(lfos, gui, "fillOpacity"),
    strokeOpacity: getLfoValue(lfos, gui, "strokeOpacity"),
    shape: gui.shape,
    mirrorX: gui.mirrorX,
    mirrorY: gui.mirrorY,
    prevX: state.lastX,
    prevY: state.lastY,
    strokeWeight: getLfoValue(lfos, gui, "strokeWeight"),
    saturation: getLfoValue(lfos, gui, "saturation"),
    brightness: getLfoValue(lfos, gui, "brightness"),
    text: gui.text,
  };
};

const getLfoValue = (
  lfos: Paintbrush[],
  gui: GuiValues,
  parameter: LfoTarget
): number => {
  let lfoCount = 0;
  let runningValue = 0;

  for (const lfo of lfos) {
    if (lfo[parameter]) {
      lfoCount++;

      const param = parameter as Exclude<LfoTarget, "fillHue" | "strokeHue">;
      runningValue += lfo[param];
    }
  }

  const param = parameter as Exclude<
    LfoTarget,
    "fillColor" | "strokeColor" | "x" | "y"
  >;
  // return the LFO value (default to GUI if no active lfo for given param)
  return lfoCount > 0 ? runningValue / lfoCount : gui[param];
};

export const useLfo = (p5: p5, gui: GuiValues, lfo: Lfo): Paintbrush => {
  const {
    speed,
    amount,
    shape,
    fillOpacity,
    strokeOpacity,
    size,
    fillHue,
    strokeHue,
    floor,
    x,
    y,
    strokeWeight,
    saturation,
    brightness,
  } = lfo.gui;

  // x & y don't have default values from GUI, so prepopulate w/ current mouse X/Y
  const values: Partial<Paintbrush> = {
    x: p5.mouseX,
    y: p5.mouseY,
  };

  // if any of the LFO targetable params are enabled, advance the lfo
  if (
    fillOpacity ||
    strokeOpacity ||
    size ||
    fillHue ||
    strokeHue ||
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
    values.y =
      p5.mouseY + (Waveforms[shape](floor, lfo.value) * 2 - 1) * amount;
  }

  if (saturation) {
    const lfoValue = Waveforms[shape](floor, lfo.value) * amount;
    values.saturation = lfoValue;
    domElements[p.SATURATION].input.value = lfoValue.toString();
    gui.saturation = lfoValue;
    dispatchUpdate(domElements.saturation.input, lfoValue);
  }

  if (brightness) {
    const lfoValue = Waveforms[shape](floor, lfo.value) * amount;
    values.brightness = lfoValue;
    domElements[p.BRIGHTNESS].input.value = lfoValue.toString();
    gui.brightness = lfoValue;
    dispatchUpdate(domElements.brightness.input, lfoValue);
  }

  if (fillOpacity) {
    // scale color values by 2.55x: 100 * 2.55 = 255
    const lfoValue = Waveforms[shape](floor, lfo.value) * (amount * 2.55);
    values.fillOpacity = lfoValue;
    domElements[p.FILL_OPACITY].input.value = lfoValue.toString();
    gui.fillOpacity = lfoValue;
    dispatchUpdate(domElements.fillOpacity.input, lfoValue);
  }

  if (fillHue) {
    // scale amount to 360 (degrees) for rotating through HSL colorspace
    const lfoValue = Waveforms[shape](floor, lfo.value) * (amount * 3.6);
    const hue = getHue(lfoValue);
    values.fillHue = hue;
    gui.fillHue = hue;
    dispatchUpdate(domElements.fillHue.input, hue);
  }

  if (strokeOpacity) {
    const lfoValue = Waveforms[shape](floor, lfo.value) * (amount * 2.55);
    values.strokeOpacity = lfoValue;
    domElements[p.STROKE_OPACITY].input.value = lfoValue.toString();
    gui.strokeOpacity = lfoValue;
    dispatchUpdate(domElements.strokeOpacity.input, lfoValue);
  }

  if (strokeHue) {
    const lfoValue = Waveforms[shape](floor, lfo.value) * (amount * 3.6);
    const hue = getHue(lfoValue);
    values.strokeHue = hue;
    gui.strokeHue = hue;
    dispatchUpdate(domElements.strokeHue.input, hue);
  }

  if (size) {
    const value =
      Waveforms[shape](floor, lfo.value) *
      ((amount * state.gui.sizeMax) / amount);
    values.size = value;
    domElements[p.SIZE].input.value = value.toString();
    dispatchUpdate(domElements.size.input, value);
  }

  if (strokeWeight) {
    const value = Waveforms[shape](floor, lfo.value) * amount;
    values.strokeWeight = value;
    domElements[p.STROKE_WEIGHT].input.value = value.toString();
    dispatchUpdate(domElements.strokeWeight.input, value);
  }

  return values as Paintbrush;
};

const getHue = (lfoValue: number) => {
  const hue = Math.floor(lfoValue);
  return hue;
};

const dispatchUpdate = (element: HTMLInputElement, value: number | string) => {
  element.dispatchEvent(new CustomEvent("paramChanged", { detail: value }));
};
