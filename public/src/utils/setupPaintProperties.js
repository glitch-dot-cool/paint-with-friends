import { Waveforms } from "./Waveforms.js";

export const setupPaintProperties = (p5, state) => {
  const { size, fillOpacity, strokeOpacity, fill, stroke } = useLfo(p5, state);
  const { rainbowFill, rainbowStroke } = useRainbow(
    p5,
    state,
    fillOpacity,
    strokeOpacity
  );

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
    isRainbowFill: state.gui.isRainbowFill,
    isRainbowStroke: state.gui.isRainbowStroke,
    rainbowFill: rainbowFill.toString(),
    rainbowStroke: rainbowStroke.toString(),
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
  const values = {
    fillOpacity: gui.fillOpacity,
    strokeOpacity: gui.strokeOpacity,
    size: gui.size,
    fill: gui.fillColor,
    stroke: gui.strokeColor,
  };

  if (fillOpacity || strokeOpacity || size || fill || stroke) {
    state.lfoValue += speed;
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
    const rainbow = newUseRainbow(p5, lfoValue, values.fillOpacity);
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
    const rainbow = newUseRainbow(p5, lfoValue, values.strokeOpacity);
    values.stroke = rainbow;
  }

  if (size) {
    values.size = gui.size + (Waveforms[shape](state.lfoValue) + 1) * amount;
  }

  return values;
};

const scaleLfoValue = (p5, lfoValue, guiValue, min, max) => {
  return p5.map(lfoValue, -max + guiValue, max + guiValue, min, max);
};

const newUseRainbow = (p5, value, opacity) => {
  const hue = Math.abs(Math.floor(value));
  const saturation = p5.map(p5.mouseY, 0, p5.windowHeight, 100, 75);
  const brightness = p5.map(p5.mouseY, 0, p5.windowHeight, 100, 50);

  const rainbow = p5.color(`hsb(${hue}, ${saturation}%, ${brightness}%)`);
  rainbow.setAlpha(Math.ceil(opacity));

  return rainbow.toString("#rrggbb");
};

const useRainbow = (p5, state, fillOpacity, strokeOpacity) => {
  state.rainbowCounter += 1 * state.gui.rainbowSpeed;

  const hue = Math.floor(state.rainbowCounter % 360);
  const saturation = p5.map(p5.mouseY, 0, p5.windowHeight, 100, 75);
  const brightness = p5.map(p5.mouseY, 0, p5.windowHeight, 100, 50);

  const rainbowFill = p5.color(`hsb(${hue}, ${saturation}%, ${brightness}%)`);
  rainbowFill.setAlpha(Math.ceil(fillOpacity));

  const rainbowStroke = p5.color(`hsb(${hue}, ${saturation}%, ${brightness}%)`);
  rainbowStroke.setAlpha(Math.ceil(strokeOpacity));

  return { rainbowFill, rainbowStroke };
};
