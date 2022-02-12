export const setBaseUrl = () => {
  const api = {
    dev: "http://localhost:3000",
    prod: "https://glitch-dot-paint.herokuapp.com",
  };
  const prodUrls = [
    "https://glitch-dot-paint.herokuapp.com/",
    "http://glitch-dot-paint.herokuapp.com/",
  ];
  const url = window.location.href;
  const isProd = prodUrls.includes(url);

  return isProd ? api.prod : api.dev;
};
