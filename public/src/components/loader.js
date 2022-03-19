export class Loader {
  static show = () => {
    const container = document.createElement("div");
    container.id = "loader-container";

    const ring = document.createElement("div");
    ring.classList.add("loader-ring");

    for (let i = 0; i < 4; i++) {
      const subdiv = document.createElement("div");
      ring.appendChild(subdiv);
    }

    container.appendChild(ring);
    document.body.appendChild(container);
  };

  static hide = () => {
    const container = document.querySelector("#loader-container");

    // remove inner loader nodes
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    container.remove();

    Loader._unhideMainUi();
  };

  static _unhideMainUi = () => {
    const canvases = document.querySelectorAll("canvas");
    const chat = document.querySelector("#chat-form");
    const connectedUsers = document.querySelector("#username-list-container");

    // unhide canvases
    canvases.forEach((canvas) => (canvas.style.display = "block"));

    // unhide other UI elements
    chat.style.display = "flex";
    connectedUsers.style.display = "block";
  };
}
