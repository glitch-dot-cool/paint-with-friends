import {
  GuiParams,
  LfoParams,
  LfoTarget,
  Paintbrush,
  State,
} from "./types/paint.js";

// common state variables used by client & server
const commonState: Omit<Paintbrush, "x" | "y" | "shape"> = {
  text: "",
  fillColor: "#349beb",
  fillOpacity: 255,
  strokeColor: "#349beb",
  strokeOpacity: 255,
  saturation: 100,
  brightness: 100,
  size: 15,
  strokeWeight: 1,
  mirrorX: false,
  mirrorY: false,
};

// server state requires initial x/y coords
export const initialServerState: Omit<Paintbrush, "shape"> = {
  ...commonState,
  x: 0,
  y: 0,
};

// client requires a few extra params for rendering UI controls
const guiParams: GuiParams = {
  shape: ["line", "circle", "square", "text"],
  ...commonState,
  sizeMin: 5,
  sizeMax: 300,
};

// params for generating LFO UI panels
const lfoParams: LfoParams = {
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
const lfoControllableParams: LfoTarget[] = [
  "fillColor",
  "fillOpacity",
  "strokeColor",
  "strokeColor",
  "strokeWeight",
  "size",
  "x",
  "y",
  "saturation",
  "brightness",
];

// add toggle controls for each available LFO target
lfoControllableParams.forEach((param) => (lfoParams[param] = false));

// full client-side state object
export const state: State = {
  gui: guiParams,
  lfo1: { gui: { ...lfoParams }, value: 0 },
  lfo2: { gui: { ...lfoParams }, value: 0 },
  lfo3: { gui: { ...lfoParams }, value: 0 },
  lastX: null,
  lastY: null,
  isDrawing: false,
  hasInitializedMessages: false,
};
