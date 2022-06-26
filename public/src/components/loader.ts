export class Loader {
  static show = () => {
    const container = document.createElement("div");
    container.id = "loader-container";
    container.classList.add("fade-in");

    const logo = document.createElement("img");
    logo.classList.add("logo");
    logo.src = "../assets/icon.png";

    const ring = document.createElement("div");
    ring.classList.add("loader-ring");

    for (let i = 0; i < 4; i++) {
      const subdiv = document.createElement("div");
      ring.appendChild(subdiv);
    }

    ring.appendChild(logo);
    container.appendChild(ring);
    document.body.appendChild(container);
  };

  static hide = () => {
    const container = document.querySelector("#loader-container");

    // remove inner loader nodes
    while (container?.firstChild) {
      container.removeChild(container.firstChild);
    }

    container?.remove();

    Loader._unhideMainUi();
  };

  static _unhideMainUi = () => {
    const canvases = document.querySelectorAll("canvas");
    const chat = document.querySelector("#chat-form");
    const connectedUsers = document.querySelector("#username-list-container");

    // unhide canvases
    canvases.forEach((canvas) => {
      canvas.classList.add("fade-in");
    });

    // unhide other UI elements
    chat?.classList.add("fade-in");
    connectedUsers?.classList.add("fade-in");
  };
}
