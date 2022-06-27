import { Response } from "express";
import sharp from "sharp";
import { ImageCache } from "./types";

export const getCanvasBuffer = (serializeCanvas: () => string) => {
  const canvasData = serializeCanvas();
  return Buffer.from(
    canvasData.replace(/^data:image\/png;base64,/, ""),
    "base64"
  );
};

export const sendImage = (res: Response, image: Buffer | null) => {
  if (!image) throw new Error("No image found in cache!");

  res.writeHead(200, {
    "Content-Type": "image/png",
    "Content-Length": image.length,
  });
  res.end(image);
};

export const sendError = (
  res: Response,
  error: Error | unknown,
  message: string
) => {
  if (error instanceof Error) {
    res.json({ message, error: error.message }).status(500);
  } else res.json({ message }).status(500);
};

export const invalidateCache = (cache: ImageCache) => {
  cache.image.shouldFetch = true;
  cache.thumbnail.shouldFetch = true;
};

export const setCache = (
  cache: ImageCache,
  key: "thumbnail" | "image",
  data: Buffer
) => {
  cache[key] = { data, shouldFetch: false };
};

export const generateThumbnail = async (imageBuffer: Buffer) => {
  return await sharp(imageBuffer)
    .resize(1280, 720)
    .jpeg({ mozjpeg: true })
    .toBuffer();
};
