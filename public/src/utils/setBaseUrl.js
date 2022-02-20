export const setBaseUrl = () => {
  const api = {
    dev: "http://localhost:3000",
    prod: "https://paint.glitch.cool",
  };
  const prodUrls = ["https://paint.glitch.cool"];
  const url = window.location.href;
  const isProd = prodUrls.includes(url);

  return isProd ? api.prod : api.dev;
};
