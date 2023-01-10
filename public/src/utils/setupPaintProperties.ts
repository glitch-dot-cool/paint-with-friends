import { Waveforms } from "./Waveforms.js";
import { paintProperties as p } from "../constants.js";
import { Camera } from "./Camera.js";
import { state } from "../initialState.js";
import {
  DrawUpdate,
  LeanDrawUpdate,
  GuiValues,
  Lfo,
  LfoTarget,
  Paintbrush,
  State,
} from "../../../types";

const cache: Record<string, HTMLInputElement | HTMLLabelElement> = {};

const getLfoTargetDOMNode = (
  target: string,
  inputOrLabel: "input" | "label"
) => {
  const key = `#${target} ${inputOrLabel}`;

  if (!cache[key]) {
    const element: HTMLInputElement | HTMLLabelElement | null =
      document.querySelector(key);
    if (element) cache[key] = element;
    return cache[key];
  } else return cache[key];
};

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
    const input = getLfoTargetDOMNode(
      p.SATURATION,
      "input"
    ) as HTMLInputElement;
    input.value = lfoValue.toString();
  }

  if (brightness) {
    const lfoValue = Waveforms[shape](floor, lfo.value) * amount;
    values.brightness = lfoValue;
    const input = getLfoTargetDOMNode(
      p.BRIGHTNESS,
      "input"
    ) as HTMLInputElement;
    input.value = lfoValue.toString();
  }

  if (fillOpacity) {
    // scale color values by 2.55x: 100 * 2.55 = 255
    const lfoValue = Waveforms[shape](floor, lfo.value) * (amount * 2.55);
    values.fillOpacity = lfoValue;
    const input = getLfoTargetDOMNode(
      p.FILL_OPACITY,
      "input"
    ) as HTMLInputElement;
    input.value = lfoValue.toString();
  }

  if (fillHue) {
    // scale amount to 360 (degrees) for rotating through HSL colorspace
    const lfoValue = Waveforms[shape](floor, lfo.value) * (amount * 3.6);
    const rainbow = useRainbow(lfoValue);
    values.fillHue = rainbow;
    const label = getLfoTargetDOMNode(p.FILL_HUE, "label") as HTMLInputElement;
    label.style.backgroundColor = rainbow.toString();
    // update gui color to last value from lfo
    gui.fillHue = rainbow;
  }

  if (strokeOpacity) {
    const lfoValue = Waveforms[shape](floor, lfo.value) * (amount * 2.55);
    values.strokeOpacity = lfoValue;
    const input = getLfoTargetDOMNode(
      p.STROKE_OPACITY,
      "input"
    ) as HTMLInputElement;
    input.value = lfoValue.toString();
  }

  if (strokeHue) {
    const lfoValue = Waveforms[shape](floor, lfo.value) * (amount * 3.6);
    const rainbow = useRainbow(lfoValue);
    values.strokeHue = rainbow;
    const label = getLfoTargetDOMNode(
      p.STROKE_HUE,
      "label"
    ) as HTMLInputElement;
    label.style.backgroundColor = rainbow.toString();
    gui.strokeHue = rainbow;
  }

  if (size) {
    const value =
      Waveforms[shape](floor, lfo.value) *
      ((amount * state.gui.sizeMax) / amount);
    values.size = value;
    const input = getLfoTargetDOMNode(p.SIZE, "input") as HTMLInputElement;
    input.value = value.toString();
  }

  if (strokeWeight) {
    const value = Waveforms[shape](floor, lfo.value) * amount;
    values.strokeWeight = value;
    const input = getLfoTargetDOMNode(
      p.STROKE_WEIGHT,
      "input"
    ) as HTMLInputElement;
    input.value = value.toString();
  }

  return values as Paintbrush;
};

const useRainbow = (lfoValue: number) => {
  const hue = Math.floor(lfoValue);
  return hue;
};

// Converts paint properties object to an ordered array to reduce payload size.
export const convertToLeanPaintProperties = (
  paintProperties: DrawUpdate,
  username: string
): LeanDrawUpdate => {
  return [
    username,
    paintProperties.x,
    paintProperties.y,
    paintProperties.fillHue,
    paintProperties.fillOpacity,
    paintProperties.strokeHue,
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

// Converts "lean" (array) representation of paint properties back to the object
// shape used within the client/server p5 applications.
export const convertLeanPaintPropertiesToObject = (
  leanPaintProperties: LeanDrawUpdate
): DrawUpdate => {
  return {
    x: leanPaintProperties[1],
    y: leanPaintProperties[2],
    fillHue: leanPaintProperties[3],
    fillOpacity: leanPaintProperties[4],
    strokeHue: leanPaintProperties[5],
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
