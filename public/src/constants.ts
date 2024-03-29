export const paintProperties = {
  FILL_COLOR: "fillColor",
  STROKE_COLOR: "strokeColor",
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

export const animateableLfoParams = [
  paintProperties.FILL_COLOR,
  paintProperties.FILL_OPACITY,
  paintProperties.STROKE_COLOR,
  paintProperties.STROKE_OPACITY,
  paintProperties.STROKE_WEIGHT,
  paintProperties.SIZE,
] as const;

export const dimensions = { width: 3840, height: 2160 }; // 4k

export const EVENTS = {
  DRAW_UPDATE: "drawUpdate",
  NEW_CONNECTION: "connection",
  CONNECTED: "connected",
  DISCONNECT: "disconnect",
  MEMBERS_CHANGED: "membersChanged",
  MESSAGE: "message",
  MOUSE_RELEASED: "mouseReleased",
  USER_DRAW_STATUS_UPDATED: "userDrawStatusUpdated",
} as const;

const GUI_WIDTH = 200;
export const GUI_GUTTER = 20;
export const GUI_OFFSET = 0 + 2 * GUI_GUTTER + GUI_WIDTH;

export const MIN_FRAMERATE = 15;
export const MAX_FRAMERATE = 60;
export const ONE_SECOND_IN_MS = 1_000;
export const DESIRED_UPDATE_RATE = 240; // per second
