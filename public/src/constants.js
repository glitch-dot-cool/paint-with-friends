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
};

export const dimensions = { width: 3840, height: 2160 }; // 1080p-friendly

export const EVENTS = {
  DRAW_UPDATE: "drawUpdate",
  NEW_CONNECTION: "connection",
  CONNECTED: "connected",
  DISCONNECT: "disconnect",
  MEMBERS_CHANGED: "membersChanged",
  MESSAGE: "message",
};

const GUI_WIDTH = 200;
export const GUI_GUTTER = 20;
export const GUI_OFFSET = 0 + 2 * GUI_GUTTER + GUI_WIDTH;
