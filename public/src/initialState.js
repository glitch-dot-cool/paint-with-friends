const guiParams = {
  fillColor: "#349beb",
  fillOpacity: 255,
  strokeColor: "#000000",
  strokeOpacity: 255,
  size: 15,
  sizeMin: 5,
  sizeMax: 300,
  shape: ["circle", "square"],
  mirrorX: false,
  mirrorY: false,
  isRainbowFill: false,
  isRainbowStroke: false,
  rainbowSpeed: 0.5,
  rainbowSpeedMin: 0,
  rainbowSpeedMax: 1,
  rainbowSpeedStep: 0.01,
  isSizeOscillating: false,
  sizeOscSpeed: 0.001,
  sizeOscSpeedMin: 0,
  sizeOscSpeedMax: 0.2,
  sizeOscSpeedStep: 0.001,
  sizeOscAmount: 1,
  sizeOscAmountMin: 0,
  sizeOscAmountMax: 100,
  sizeOscAmountStep: 0.01,
};

const lfoControllableParams = ["fillOpacity", "strokeOpacity", "size"];

const lfoParams = {
  speed: 0.001,
  speedMin: 0,
  speedMax: 0.2,
  speedStep: 0.001,
  amount: 1,
  amountMin: 0,
  amountMax: 100,
  amountStep: 0.01,
  shape: ["sine", "triangle", "square", "saw", "random"],
};

// add toggle controls for each available LFO target
lfoControllableParams.forEach((param) => (lfoParams[param] = false));

export const state = {
  gui: guiParams,
  lfo: lfoParams,
  rainbowCounter: 0,
  sizeOsc: 0,
  lfoValue: 0,
};
