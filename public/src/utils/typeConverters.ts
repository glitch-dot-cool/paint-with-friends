import { DrawUpdate, LeanDrawUpdate } from "../../../types";

// Converts paint properties object to an ordered array to reduce payload size.
export const convertToLeanPaintProperties = (
  paintProperties: DrawUpdate,
  username: string,
  socketId: string
): LeanDrawUpdate => {
  return [
    username,
    socketId,
    paintProperties.x,
    paintProperties.y,
    paintProperties.fillColor,
    paintProperties.fillOpacity,
    paintProperties.strokeColor,
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
    paintProperties.shouldUseIntrinsicBrightness,
    paintProperties.shouldUseIntrinsicSaturation,
  ];
};

// Converts "lean" (array) representation of paint properties back to the object
// shape used within the client/server p5 applications.
export const convertLeanPaintPropertiesToObject = (
  leanPaintProperties: LeanDrawUpdate
): DrawUpdate => {
  return {
    x: leanPaintProperties[2],
    y: leanPaintProperties[3],
    fillColor: leanPaintProperties[4],
    fillOpacity: leanPaintProperties[5],
    strokeColor: leanPaintProperties[6],
    strokeOpacity: leanPaintProperties[7],
    mirrorX: leanPaintProperties[8],
    mirrorY: leanPaintProperties[9],
    shape: leanPaintProperties[10],
    size: leanPaintProperties[11],
    prevX: leanPaintProperties[12],
    prevY: leanPaintProperties[13],
    strokeWeight: leanPaintProperties[14],
    saturation: leanPaintProperties[15],
    brightness: leanPaintProperties[16],
    text: leanPaintProperties[17],
    shouldUseIntrinsicBrightness: leanPaintProperties[18],
    shouldUseIntrinsicSaturation: leanPaintProperties[19],
  };
};
