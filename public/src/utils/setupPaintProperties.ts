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
    fillColor: getLfoColorValue(p5, gui, lfos, "fillColor"),
    strokeColor: getLfoColorValue(p5, gui, lfos, "strokeColor"),
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

      const param = parameter as Exclude<
        LfoTarget,
        "fillColor" | "strokeColor"
      >;
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

const getLfoColorValue = (
  p5: p5,
  gui: GuiValues,
  lfos: Paintbrush[],
  parameter: "fillColor" | "strokeColor"
): string => {
  let lfoCount = 0;
  let colorsArray = [0, 0, 0];

  for (const lfo of lfos) {
    if (lfo[parameter]) {
      lfoCount++;

      const param = parameter as "fillColor" | "strokeColor";
      // @ts-ignore - levels *is* a property of p5.Color, I think there's an issue w/ @types/p5
      const levels: [number, number, number, number] = lfo[param].levels;

      // sum rgb values from lfos
      for (let i = 0; i < 3; i++) {
        colorsArray[i] += levels[i as 0 | 1 | 2];
      }

      colorsArray = colorsArray.map((colorChannel) =>
        p5.map(colorChannel, 0, 255 * lfoCount, 0, 255)
      );
    }
  }

  return lfoCount > 0
    ? p5.color(colorsArray).toString("#rrggbb")
    : gui[parameter];
};

export const useLfo = (p5: p5, gui: GuiValues, lfo: Lfo): Paintbrush => {
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
  const values: Partial<Paintbrush> = {
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

  if (fillColor) {
    // scale amount to 360 (degrees) for rotating through HSL colorspace
    const lfoValue = Waveforms[shape](floor, lfo.value) * (amount * 3.6);
    const rainbow = useRainbow(p5, lfoValue);
    values.fillColor = rainbow;
    const label = getLfoTargetDOMNode(
      p.FILL_COLOR,
      "label"
    ) as HTMLInputElement;
    label.style.backgroundColor = rainbow.toString();
    // update gui color to last value from lfo
    gui.fillColor = rainbow.toString();
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

  if (strokeColor) {
    const lfoValue = Waveforms[shape](floor, lfo.value) * (amount * 3.6);
    const rainbow = useRainbow(p5, lfoValue);
    values.strokeColor = rainbow;
    const label = getLfoTargetDOMNode(
      p.STROKE_COLOR,
      "label"
    ) as HTMLInputElement;
    label.style.backgroundColor = rainbow.toString();
    gui.strokeColor = rainbow.toString();
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

const useRainbow = (p5: p5, lfoValue: number) => {
  const hue = Math.floor(lfoValue);
  // saturation & brightness will be overridden by global paintbrush setting
  return p5.color(`hsb(${hue}, 100%, 100%)`);
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

// Converts "lean" (array) representation of paint properties back to the object
// shape used within the client/server p5 applications.
export const convertLeanPaintPropertiesToObject = (
  leanPaintProperties: LeanDrawUpdate
): DrawUpdate => {
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
