import { Waveforms } from "./Waveforms.js";

export const setupPaintProperties = (p5, state) => {
  const { size, fillOpacity, strokeOpacity } = useLfo(p5, state);
  const { rainbowFill, rainbowStroke } = useRainbow(
    p5,
    state,
    fillOpacity,
    strokeOpacity
  );

  return {
    x: p5.mouseX,
    y: p5.mouseY,
    fillColor: state.gui.fillColor,
    strokeColor: state.gui.strokeColor,
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
  const { speed, amount, shape, fillOpacity, strokeOpacity, size } = lfo;
  const values = {
    fillOpacity: gui.fillOpacity,
    strokeOpacity: gui.strokeOpacity,
    size: gui.size,
  };

  if (fillOpacity || strokeOpacity || size) {
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

  if (strokeOpacity) {
    const lfoValue =
      gui.strokeOpacity + Waveforms[shape](state.lfoValue) * (amount * 2.55);

    const scaledValue = scaleLfoValue(p5, lfoValue, gui.strokeOpacity, 0, 255);

    values.strokeOpacity = scaledValue;
  }

  if (size) {
    values.size = gui.size + (Waveforms[shape](state.lfoValue) + 1) * amount;
  }

  return values;
};

const scaleLfoValue = (p5, lfoValue, guiValue, min, max) => {
  return p5.map(lfoValue, -max + guiValue, max + guiValue, min, max);
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
