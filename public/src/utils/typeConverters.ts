import { DrawUpdate, LeanDrawUpdate } from "../../../types";

// Converts paint properties object to an ordered array to reduce payload size.
export const convertToLeanPaintProperties = (
  paintProperties: DrawUpdate,
  username: string
): LeanDrawUpdate => {
  return [
    username,
    paintProperties.x,
    paintProperties.y,
    paintProperties.fillHue,
    paintProperties.fillOpacity,
    paintProperties.strokeHue,
    paintProperties.strokeOpacity,
    paintProperties.mirrorX,
    paintProperties.mirrorY,
    paintProperties.shape,
    paintProperties.size,
    paintProperties.prevX,
    paintProperties.prevY,
    paintProperties.strokeWeight,
    paintProperties.saturation,
    paintProperties.brightness,
    paintProperties.text,
  ];
};

// Converts "lean" (array) representation of paint properties back to the object
// shape used within the client/server p5 applications.
export const convertLeanPaintPropertiesToObject = (
  leanPaintProperties: LeanDrawUpdate
): DrawUpdate => {
  return {
    x: leanPaintProperties[1],
    y: leanPaintProperties[2],
    fillHue: leanPaintProperties[3],
    fillOpacity: leanPaintProperties[4],
    strokeHue: leanPaintProperties[5],
    strokeOpacity: leanPaintProperties[6],
    mirrorX: leanPaintProperties[7],
    mirrorY: leanPaintProperties[8],
    shape: leanPaintProperties[9],
    size: leanPaintProperties[10],
    prevX: leanPaintProperties[11],
    prevY: leanPaintProperties[12],
    strokeWeight: leanPaintProperties[13],
    saturation: leanPaintProperties[14],
    brightness: leanPaintProperties[15],
    text: leanPaintProperties[16],
  };
};
