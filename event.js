import EventEmitter from "events";

export const eventEmitter = new EventEmitter();

export const EVENTS = {
  DRAW_UPDATE: "drawUpdate",
};
