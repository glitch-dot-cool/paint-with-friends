import { Waveforms } from "./Waveforms.js";

export const setupPaintProperties = (p5, state) => {
  const { size, fillOpacity, strokeOpacity, fill, stroke } = useLfo(p5, state);

  return {
    x: p5.mouseX,
    y: p5.mouseY,
    fillColor: fill,
    strokeColor: stroke,
    size,
    fillOpacity,
    strokeOpacity,
    shape: state.gui.shape,
    mirrorX: state.gui.mirrorX,
    mirrorY: state.gui.mirrorY,
  };
};

export const useLfo = (p5, state) => {
  const { gui, lfo } = state;
  const {
    speed,
    amount,
    shape,
    fillOpacity,
    strokeOpacity,
    size,
    fill,
    stroke,
  } = lfo;

  // default to the values from the GUI, if no LFO stuff is enabled, return untouched
  // if any are enabled, they will be overwritten by their LFO'd values
  const values = {
    fillOpacity: gui.fillOpacity,
    strokeOpacity: gui.strokeOpacity,
    size: gui.size,
    fill: gui.fillColor,
    stroke: gui.strokeColor,
  };

  // if any of the LFO targetable params are enabled, advance the lfo
  if (fillOpacity || strokeOpacity || size || fill || stroke) {
    state.lfoValue += speed;
    // up to PI * 2 because geometry
    state.lfoValue %= Math.PI * 2;
  }

  if (fillOpacity) {
    // scale color values by 2.55x: 100 * 2.55 = 255
    const lfoValue =
      gui.fillOpacity + Waveforms[shape](state.lfoValue) * (amount * 2.55);

    const scaledValue = scaleLfoValue(p5, lfoValue, gui.fillOpacity, 0, 255);

    values.fillOpacity = scaledValue;
  }

  if (fill) {
    // scale amount to 360 (degrees) for rotating through HSL colorspace
    // scale lfoValue by half because the range is -360 to 360 and we use the absolute value
    // i.e. the rotation speed is 2x other values tracking the LFO, so halve the speed
    const lfoValue = Waveforms[shape](state.lfoValue * 0.5) * (amount * 3.6);
    const rainbow = useRainbow(p5, lfoValue, values.fillOpacity);
    values.fill = rainbow;
  }

  if (strokeOpacity) {
    const lfoValue =
      gui.strokeOpacity + Waveforms[shape](state.lfoValue) * (amount * 2.55);

    const scaledValue = scaleLfoValue(p5, lfoValue, gui.strokeOpacity, 0, 255);

    values.strokeOpacity = scaledValue;
  }

  if (stroke) {
    const lfoValue = Waveforms[shape](state.lfoValue * 0.5) * (amount * 3.6);
    const rainbow = useRainbow(p5, lfoValue, values.strokeOpacity);
    values.stroke = rainbow;
  }

  if (size) {
    // +1 so the oscillation never goes below the minimum/default size set in paintbrush options
    values.size = gui.size + (Waveforms[shape](state.lfoValue) + 1) * amount;
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
