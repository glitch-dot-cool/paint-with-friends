export const setupPaintProperties = (p5, state) => {
  const { rainbowFill, rainbowStroke } = useRainbow(p5, state);

  return {
    x: p5.mouseX,
    y: p5.mouseY,
    fillColor: state.gui.fillColor,
    fillOpacity: state.gui.fillOpacity,
    strokeColor: state.gui.strokeColor,
    strokeOpacity: state.gui.strokeOpacity,
    size: modulateSize(p5, state),
    shape: state.gui.shape,
    mirrorX: state.gui.mirrorX,
    mirrorY: state.gui.mirrorY,
    isRainbowFill: state.gui.isRainbowFill,
    isRainbowStroke: state.gui.isRainbowStroke,
    rainbowFill: rainbowFill.toString(),
    rainbowStroke: rainbowStroke.toString(),
  };
};

const modulateSize = (p5, state) => {
  const { isSizeOscillating, sizeOscSpeed, sizeOscAmount, size } = state.gui;

  if (isSizeOscillating) {
    state.sizeOsc += sizeOscSpeed;
    return size + (p5.sin(state.sizeOsc) + 1) * sizeOscAmount;
  }

  return size;
};

const useRainbow = (p5, state) => {
  state.rainbowCounter += 1 * state.gui.rainbowSpeed;

  const hue = Math.floor(state.rainbowCounter % 360);
  const saturation = p5.map(p5.mouseY, 0, p5.windowHeight, 100, 75);
  const brightness = p5.map(p5.mouseY, 0, p5.windowHeight, 100, 50);

  const rainbowFill = p5.color(`hsb(${hue}, ${saturation}%, ${brightness}%)`);
  rainbowFill.setAlpha(state.gui.fillOpacity);

  const rainbowStroke = p5.color(`hsb(${hue}, ${saturation}%, ${brightness}%)`);
  rainbowStroke.setAlpha(state.gui.strokeOpacity);

  return { rainbowFill, rainbowStroke };
};
