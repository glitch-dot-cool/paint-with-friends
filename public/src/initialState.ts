import {
  DrawUpdate,
  GuiParams,
  GuiValues,
  LfoParams,
  LfoTarget,
  LfoValues,
  State,
} from "../../types";

// common state variables used by client & server
const commonState: Omit<
  DrawUpdate,
  "x" | "y" | "shape" | "prevX" | "prevY" | "username"
> = {
  text: "",
  fillHue: 0,
  fillOpacity: 255,
  strokeHue: 0,
  strokeOpacity: 255,
  saturation: 100,
  brightness: 50,
  size: 15,
  strokeWeight: 1,
  mirrorX: false,
  mirrorY: false,
};

// server state requires initial x/y coords
export const initialServerState: Omit<
  DrawUpdate,
  "shape" | "prevX" | "prevY" | "username"
> = {
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
  fillHueMax: 360,
  strokeHueMax: 360,
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
  "fillHue",
  "fillOpacity",
  "strokeHue",
  "strokeOpacity",
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
  /**
   the unfortunate casting is a result of the way the p5.gui library works:
   for html select elements, you provide it an array of values (GuiValues/LfoValues)
   and it generates the UI but transforms the under-the-hood state value to the first option initially.
   i.e. the "Params" versions of the interfaces *are* what is here, but by the time the p5 app
   consumes the object, it's taken the shape of the "Values" interfaces. because the latter is how 
   the object is used in every case other than the initial UI generation, i've opted to handle the 
   casting in a single location here
   */
  gui: guiParams as unknown as GuiValues,
  lfo1: { gui: { ...(lfoParams as unknown as LfoValues) }, value: 0 },
  lfo2: { gui: { ...(lfoParams as unknown as LfoValues) }, value: 0 },
  lfo3: { gui: { ...(lfoParams as unknown as LfoValues) }, value: 0 },
  lastX: 0,
  lastY: 0,
  isDrawing: false,
  hasInitializedMessages: false,
};
