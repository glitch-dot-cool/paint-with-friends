import { paintProperties as p } from "./constants.js";

const guiParams = {
  [p.FILL_COLOR]: "#349beb",
  [p.FILL_OPACITY]: 255,
  [p.STROKE_COLOR]: "#000000",
  [p.STROKE_OPACITY]: 255,
  [p.SIZE]: 15,
  sizeMin: 5,
  sizeMax: 300,
  [p.SHAPE]: ["circle", "square"],
  [p.MIRROR_X]: false,
  [p.MIRROR_Y]: false,
};

const lfoControllableParams = [
  p.FILL_OPACITY,
  p.STROKE_OPACITY,
  p.SIZE,
  p.FILL_COLOR,
  p.STROKE_COLOR,
];

const lfoParams = {
  speed: 0.00005,
  speedMin: 0.00001,
  speedMax: 0.5,
  speedStep: 0.00001,
  floor: 0,
  floorMin: 0,
  floorMax: 100,
  floorStep: 1,
  amount: 50,
  amountMin: 0,
  amountMax: 100,
  amountStep: 0.01,
  shape: ["sine", "triangle", "square", "saw", "random", "noise"],
  saturation: 100,
  brightness: 100,
};

// add toggle controls for each available LFO target
lfoControllableParams.forEach((param) => (lfoParams[param] = false));

export const state = {
  gui: guiParams,
  lfo1: { gui: { ...lfoParams }, value: 0 },
  lfo2: { gui: { ...lfoParams }, value: 0 },
  lfo3: { gui: { ...lfoParams }, value: 0 },
};
