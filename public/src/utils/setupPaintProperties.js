import { Waveforms } from "./Waveforms.js";

export const setupPaintProperties = (p5, state) => {
  const { gui } = state;
  const lfo1 = useLfo(p5, state.gui, state.lfo1);
  const lfo2 = useLfo(p5, state.gui, state.lfo2);

  return {
    x: p5.mouseX,
    y: p5.mouseY,
    fillColor: handleLfoValue(lfo1, lfo2, gui, "fillColor"),
    strokeColor: handleLfoValue(lfo1, lfo2, gui, "strokeColor"),
    size: handleLfoValue(lfo1, lfo2, gui, "size"),
    fillOpacity: handleLfoValue(lfo1, lfo2, gui, "fillOpacity"),
    strokeOpacity: handleLfoValue(lfo1, lfo2, gui, "strokeOpacity"),
    shape: gui.shape,
    mirrorX: gui.mirrorX,
    mirrorY: gui.mirrorY,
  };
};

// default to the values from the GUI if no LFO stuff is enabled
// if any are enabled, they will be overwritten by their LFO'd values
const handleLfoValue = (lfo1, lfo2, gui, value) => {
  if (lfo2[value]) return lfo2[value];
  if (lfo1[value]) return lfo1[value];
  else return gui[value];
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
  } = lfo.gui;

  const values = {};

  // if any of the LFO targetable params are enabled, advance the lfo
  if (fillOpacity || strokeOpacity || size || fillColor || strokeColor) {
    lfo.value += speed;
    // up to PI * 2 because geometry
    lfo.value %= Math.PI * 2;
  }

  if (fillOpacity) {
    // scale color values by 2.55x: 100 * 2.55 = 255
    const lfoValue =
      gui.fillOpacity + Waveforms[shape](lfo.value) * (amount * 2.55);

    const scaledValue = scaleLfoValue(p5, lfoValue, gui.fillOpacity, 0, 255);

    values.fillOpacity = scaledValue;
  }

  if (fillColor) {
    // scale amount to 360 (degrees) for rotating through HSL colorspace
    // scale lfoValue by half because the range is -360 to 360 and we use the absolute value
    // i.e. the rotation speed is 2x other values tracking the LFO, so halve the speed
    const lfoValue = Waveforms[shape](lfo.value * 0.5) * (amount * 3.6);
    const rainbow = useRainbow(p5, lfoValue, values.fillOpacity);
    values.fillColor = rainbow;
  }

  if (strokeOpacity) {
    const lfoValue =
      gui.strokeOpacity + Waveforms[shape](lfo.value) * (amount * 2.55);

    const scaledValue = scaleLfoValue(p5, lfoValue, gui.strokeOpacity, 0, 255);

    values.strokeOpacity = scaledValue;
  }

  if (strokeColor) {
    const lfoValue = Waveforms[shape](lfo.value * 0.5) * (amount * 3.6);
    const rainbow = useRainbow(p5, lfoValue, values.strokeOpacity);
    values.strokeColor = rainbow;
  }

  if (size) {
    // +1 so the oscillation never goes below the minimum/default size set in paintbrush options
    values.size = gui.size + (Waveforms[shape](lfo.value) + 1) * amount;
  }

  return values;
};

// this function handles bias/offset from GUI-derived values applied to the LFO
// note: this function does not work w/ colors, just raw numbers
const scaleLfoValue = (p5, lfoValue, guiValue, min, max) => {
  return p5.map(lfoValue, -max + guiValue, max + guiValue, min, max);
};

const useRainbow = (p5, value, opacity) => {
  // values range from -360 to 360 so we use the absolute value
  // this makes the colors loop 2x as fast, so that is accounted for by halving the raw LFO value
  const hue = Math.abs(Math.floor(value));

  // TODO: add GUI sliders for these values - the values should override
  // the default color selection (i.e. even if not using useRainbow) but also effect this function
  const saturation = p5.map(p5.mouseY, 0, p5.windowHeight, 100, 75);
  const brightness = p5.map(p5.mouseY, 0, p5.windowHeight, 100, 50);

  const rainbow = p5.color(`hsb(${hue}, ${saturation}%, ${brightness}%)`);
  rainbow.setAlpha(Math.ceil(opacity));

  return rainbow.toString("#rrggbb");
};
