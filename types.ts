import { paintProperties } from "./public/src/constants.js";

export type PaintProperties =
  typeof paintProperties[keyof typeof paintProperties];

// BASE DRAWING/BRUSH TYPES
export type BrushShape = "line" | "circle" | "square" | "text";

export interface Paintbrush {
  text: string;
  fillHue: number;
  fillOpacity: number;
  strokeHue: number;
  strokeOpacity: number;
  size: number;
  shape: BrushShape;
  mirrorX: boolean;
  mirrorY: boolean;
  x: number;
  y: number;
  prevX: number;
  prevY: number;
  strokeWeight: number;
  saturation: number;
  brightness: number;
}

export interface GuiParams
  extends Omit<
    DrawUpdate,
    "shape" | "x" | "y" | "prevX" | "prevY" | "username"
  > {
  sizeMin: number;
  sizeMax: number;
  shape: BrushShape[];
  fillHueMax: number;
  strokeHueMax: number;
}

export interface GuiValues extends Omit<GuiParams, "shape"> {
  shape: BrushShape;
}

export type LfoShape =
  | "sine"
  | "triangle"
  | "square"
  | "saw"
  | "random"
  | "noise";

interface LfoTargets {
  fillHue?: boolean;
  fillOpacity?: boolean;
  strokeHue?: boolean;
  strokeOpacity?: boolean;
  strokeWeight?: boolean;
  size?: boolean;
  x?: boolean;
  y?: boolean;
  saturation?: boolean;
  brightness?: boolean;
}

export type LfoTarget = keyof LfoTargets;
export interface LfoParams extends LfoTargets {
  shape: LfoShape[];
  speed: number;
  speedMin: number;
  speedMax: number;
  speedStep: number;
  floor: number;
  floorMin: number;
  floorMax: number;
  floorStep: number;
  amount: number;
  amountMin: number;
  amountMax: number;
  amountStep: number;
}

export interface LfoValues extends Omit<LfoParams, "shape"> {
  shape: LfoShape;
}

export interface Lfo {
  value: number;
  gui: LfoValues;
}

export interface State {
  gui: GuiValues;
  lfo1: Lfo;
  lfo2: Lfo;
  lfo3: Lfo;
  lastX: number;
  lastY: number;
  isDrawing: boolean;
  hasInitializedMessages: boolean;
}

export type CanvasDimensions = { width: number; height: number };

type CircleOrSquareMirrorArgs = [x: number, y: number, size: number];
type LineMirrorArgs = [lastX: number, lastY: number, x: number, y: number];
type TextMirrorArgs = [text: string, x: number, y: number];

type MirrorArgs = CircleOrSquareMirrorArgs | LineMirrorArgs | TextMirrorArgs;

export type SetupShapeReturnValues = {
  default: MirrorArgs;
  mirrorX: MirrorArgs;
  mirrorY: MirrorArgs;
  mirrorBoth: MirrorArgs;
};

export type MirrorModeParams = SetupShapeReturnValues & {
  fn: p5["line"] | p5["circle"] | p5["square"] | p5["text"];
};

export interface ParameterCallback<T> {
  e: CustomEvent<T>;
  input: HTMLInputElement;
  label: HTMLLabelElement;
}

// WEBSOCKET TYPES
export interface DrawUpdate
  extends Omit<Paintbrush, "fillColor" | "strokeColor"> {
  prevX: number;
  prevY: number;
  text: string;
  fillHue: number;
  strokeHue: number;
}

export type LeanDrawUpdate = [
  string,
  number,
  number,
  number,
  number,
  number,
  number,
  boolean,
  boolean,
  BrushShape,
  number,
  number,
  number,
  number,
  number,
  number,
  string
];

interface Message {
  sender: string;
  message: string;
  id: string;
}

export type Messages = Message[];

export interface Connections {
  [id: string]: {
    username: string;
    isPainting: boolean;
  };
}

export type Payload = LeanDrawUpdate | Messages | Connections;

// CUSTOM p5 TYPES
export type p5GuiInstance = {
  id: string;
  addObject: (params: GuiValues | LfoValues) => void;
  setPosition: (x?: number, y?: number) => void;
  collapse: () => void;
};

export type PaintWithFriends = p5 & {
  initCanvas: (serializedCanvas: string) => void;
  initLastCoords: () => void;
  setLastCoords: () => void;
  paint: () => void;
  createGui: (name: string, p5: p5) => p5GuiInstance;
  updateThrottleRate: (connections: Connections) => void;
};

// SERVER TYPES
export type ImageCacheEntry = { data: null | Buffer; shouldFetch: boolean };

export type ImageCache = {
  thumbnail: ImageCacheEntry;
  image: ImageCacheEntry;
};
