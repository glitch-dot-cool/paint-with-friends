export const paintProperties = {
  FILL_HUE: "fillHue",
  STROKE_HUE: "strokeHue",
  FILL_OPACITY: "fillOpacity",
  STROKE_OPACITY: "strokeOpacity",
  SIZE: "size",
  SHAPE: "shape",
  MIRROR_X: "mirrorX",
  MIRROR_Y: "mirrorY",
  X: "x",
  Y: "y",
  PREV_X: "prevX",
  PREV_Y: "prevY",
  STROKE_WEIGHT: "strokeWeight",
  SATURATION: "saturation",
  BRIGHTNESS: "brightness",
  TEXT: "text",
} as const;

export const dimensions = { width: 3840, height: 2160 }; // 4k

export const EVENTS = {
  DRAW_UPDATE: "drawUpdate",
  NEW_CONNECTION: "connection",
  CONNECTED: "connected",
  DISCONNECT: "disconnect",
  MEMBERS_CHANGED: "membersChanged",
  MESSAGE: "message",
  MOUSE_RELEASED: "mouseReleased",
};

const GUI_WIDTH = 200;
export const GUI_GUTTER = 20;
export const GUI_OFFSET = 0 + 2 * GUI_GUTTER + GUI_WIDTH;

export const MIN_FRAMERATE = 24;
export const MAX_FRAMERATE = 60;
export const USER_THROTTLE_THRESHOLD = 4; // throttling begins when > this # of users are currently painting
export const ONE_SECOND_IN_MS = 1_000;
