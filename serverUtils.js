import sharp from "sharp";

export const getCanvasBuffer = (serializeCanvas) => {
  const canvasData = serializeCanvas();
  return Buffer.from(
    canvasData.replace(/^data:image\/png;base64,/, ""),
    "base64"
  );
};

export const sendImage = (res, image) => {
  res.writeHead(200, {
    "Content-Type": "image/png",
    "Content-Length": image.length,
  });
  res.end(image);
};

export const sendError = (res, error, message) => {
  res.json({ message, error: error.message }).status(500);
};

export const invalidateCache = (cache) => {
  cache.image.shouldFetch = true;
  cache.thumbnail.shouldFetch = true;
};

export const setCache = (cache, key, data) => {
  cache[key] = { data, shouldFetch: false };
};

export const generateThumbnail = async (imageBuffer) => {
  return await sharp(imageBuffer)
    .resize(1280, 720)
    .jpeg({ mozjpeg: true })
    .toBuffer();
};
