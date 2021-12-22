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
};

const lfoControllableParams = [
  "fillOpacity",
  "strokeOpacity",
  "size",
  "fill",
  "stroke",
];

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
  sizeOsc: 0,
  lfoValue: 0,
};