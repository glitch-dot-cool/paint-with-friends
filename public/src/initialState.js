import { paintProperties as p } from "./constants.js";

// common state variables used by client & server
const commonState = {
  [p.FILL_COLOR]: "#349beb",
  [p.FILL_OPACITY]: 255,
  [p.STROKE_COLOR]: "#349beb",
  [p.STROKE_OPACITY]: 255,
  [p.SIZE]: 15,
  [p.STROKE_WEIGHT]: 1,
  [p.MIRROR_X]: false,
  [p.MIRROR_Y]: false,
};

// server state requires initial x/y coords
export const initialServerState = {
  ...commonState,
  [p.X]: 0,
  [p.Y]: 0,
};

// client requires a few extra params for rendering UI controls
const guiParams = {
  ...commonState,
  [p.SHAPE]: ["line", "circle", "square"],
  sizeMin: 5,
  sizeMax: 300,
};

// params for generating LFO UI panels
const lfoParams = {
  shape: ["sine", "triangle", "square", "saw", "random", "noise"],
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
};

// params that can be controlled via LFO
const lfoControllableParams = [
  p.FILL_COLOR,
  p.FILL_OPACITY,
  p.STROKE_COLOR,
  p.STROKE_OPACITY,
  p.STROKE_WEIGHT,
  p.SIZE,
  p.X,
  p.Y,
];

// add toggle controls for each available LFO target
lfoControllableParams.forEach((param) => (lfoParams[param] = false));
// position optional color sliders below checkboxes to prevent layout shift
lfoParams.saturation = 100;
lfoParams.brightness = 100;

// full client-side state object
export const state = {
  gui: guiParams,
  lfo1: { gui: { ...lfoParams }, value: 0 },
  lfo2: { gui: { ...lfoParams }, value: 0 },
  lfo3: { gui: { ...lfoParams }, value: 0 },
  lastX: null,
  lastY: null,
  isDrawing: false,
  hasInitializedMessages: false,
};
