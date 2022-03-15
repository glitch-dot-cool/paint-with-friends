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
};

export const dimensions = { width: 3840, height: 2160 }; // 4k

export const EVENTS = {
  DRAW_UPDATE: "drawUpdate",
  NEW_CONNECTION: "connection",
  CONNECTED: "connected",
  DISCONNECT: "disconnect",
  MEMBERS_CHANGED: "membersChanged",
  MESSAGE: "message",
  CURSOR_UPDATE: "cursorUpdate",
};

const GUI_WIDTH = 200;
export const GUI_GUTTER = 20;
export const GUI_OFFSET = 0 + 2 * GUI_GUTTER + GUI_WIDTH;
