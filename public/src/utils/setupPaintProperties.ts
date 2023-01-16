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
import { lfoDomElements } from "../ui.js";

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
  // brightness/saturation should only be overridden if set via LFO
  const shouldUseIntrinsicBrightness = !lfos.some((lfo) => lfo.brightness);
  const shouldUseIntrinsicSaturation = !lfos.some((lfo) => lfo.saturation);

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
    shouldUseIntrinsicBrightness,
    shouldUseIntrinsicSaturation,
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
  }

  if (brightness) {
    const lfoValue = Waveforms[shape](floor, lfo.value) * amount;
    values.brightness = lfoValue;
  }

  if (fillOpacity) {
    // scale color values by 2.55x: 100 * 2.55 = 255
    const lfoValue = Waveforms[shape](floor, lfo.value) * (amount * 2.55);
    values.fillOpacity = lfoValue;
    lfoDomElements.fillOpacity.input.value = lfoValue.toString();
  }

  if (fillColor) {
    // scale amount to 360 (degrees) for rotating through HSL colorspace
    const lfoValue = Waveforms[shape](floor, lfo.value) * (amount * 3.6);
    const rainbow = getHue(p5, lfoValue);
    values.fillColor = rainbow;
    lfoDomElements.fillColor.label.style.backgroundColor = rainbow.toString();
    // update gui color to last value from lfo
    gui.fillColor = rainbow.toString();
  }

  if (strokeOpacity) {
    const lfoValue = Waveforms[shape](floor, lfo.value) * (amount * 2.55);
    values.strokeOpacity = lfoValue;
    lfoDomElements.strokeOpacity.input.value = lfoValue.toString();
  }

  if (strokeColor) {
    const lfoValue = Waveforms[shape](floor, lfo.value) * (amount * 3.6);
    const rainbow = getHue(p5, lfoValue);
    values.strokeColor = rainbow;
    lfoDomElements.strokeColor.label.style.backgroundColor = rainbow.toString();
    gui.strokeColor = rainbow.toString();
  }

  if (size) {
    const value =
      Waveforms[shape](floor, lfo.value) *
      ((amount * state.gui.sizeMax) / amount);
    values.size = value;
    lfoDomElements.size.input.value = value.toString();
  }

  if (strokeWeight) {
    const value = Waveforms[shape](floor, lfo.value) * amount;
    values.strokeWeight = value;
    lfoDomElements.strokeWeight.input.value = value.toString();
  }

  return values as Paintbrush;
};

const getHue = (p5: p5, lfoValue: number) => {
  const hue = Math.floor(lfoValue);
  // saturation & brightness will be overridden by global paintbrush setting
  return p5.color(`hsb(${hue}, 100%, 100%)`);
};
