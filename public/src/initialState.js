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
  "fillColor",
  "strokeColor",
];

const lfoParams = {
  speed: 0.00005,
  speedMin: 0.00001,
  speedMax: 0.5,
  speedStep: 0.00001,
  amount: 50,
  amountMin: 0,
  amountMax: 100,
  amountStep: 0.01,
  shape: ["sine", "triangle", "square", "saw", "random"],
};

// add toggle controls for each available LFO target
lfoControllableParams.forEach((param) => (lfoParams[param] = false));

export const state = {
  gui: guiParams,
  lfo1: { gui: { ...lfoParams }, value: 0 },
  lfo2: { gui: { ...lfoParams }, value: 0 },
  lfo3: { gui: { ...lfoParams }, value: 0 },
};
