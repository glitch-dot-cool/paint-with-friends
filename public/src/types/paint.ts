export type BrushShape = "line" | "circle" | "square" | "text";

export interface Paintbrush {
  text: string;
  fillColor: string;
  fillOpacity: number;
  strokeColor: string;
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

export interface GuiParams extends Omit<Paintbrush, "shape" | "x" | "y"> {
  sizeMin: number;
  sizeMax: number;
  shape: BrushShape[];
}

export type LfoShape =
  | "sine"
  | "triangle"
  | "square"
  | "saw"
  | "random"
  | "noise";

export type LfoTarget = keyof LfoTargets;

interface LfoTargets {
  fillColor?: boolean;
  fillOpacity?: boolean;
  strokeColor?: boolean;
  strokeOpacity?: boolean;
  strokeWeight?: boolean;
  size?: boolean;
  x?: boolean;
  y?: boolean;
  saturation?: boolean;
  brightness?: boolean;
}

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

interface Lfo {
  value: number;
  gui: LfoParams;
}

export interface State {
  gui: GuiParams;
  lfo1: Lfo;
  lfo2: Lfo;
  lfo3: Lfo;
  lastX: number | null;
  lastY: number | null;
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
  fn: p5.line | p5.circle | p5.square | p5.text;
};
