import { dimensions, EVENTS } from "./constants.js";
import { Camera } from "./utils/Camera.js";

export const initCursors = (socket, camera) => {
  const cursors = (s) => {
    let color;

    s.setup = () => {
      const canvas = s.createCanvas(dimensions.width, dimensions.height);
      canvas.id("cursors");
      canvas.parent("p5-cursors");

      camera.registerCanvas(document.querySelector("#cursors"), "cursors");

      s.textFont("JetBrains Mono");

      socket.on(EVENTS.DRAW_UPDATE, (data) => {
        // first 3 elements of paint props are username & mouse x/y
        const [username, x, y] = data;
        color = s.usernameToColor(username);
        s.drawCursor(x, y, username);
      });

      socket.on(EVENTS.MOUSE_RELEASED, () => {
        s.clear();
      });
    };

    s.drawCursor = (x, y, username) => {
      s.clear();
      s.fill(color);
      s.noStroke();
      s.circle(x, y, Camera.scaleByZoomAmount(10, camera.zoomAmount));

      s.stroke(0);
      s.strokeWeight(2);
      s.textSize(Camera.scaleByZoomAmount(12, camera.zoomAmount));
      s.text(
        username,
        x + Camera.scaleByZoomAmount(8, camera.zoomAmount),
        y + Camera.scaleByZoomAmount(3, camera.zoomAmount)
      );
    };

    // https://gist.github.com/0x263b/2bdd90886c2036a1ad5bcf06d6e6fb37
    s.usernameToColor = (username) => {
      const colors = [
        "#e51c23",
        "#e91e63",
        "#9c27b0",
        "#673ab7",
        "#3f51b5",
        "#5677fc",
        "#03a9f4",
        "#00bcd4",
        "#009688",
        "#259b24",
        "#8bc34a",
        "#afb42b",
        "#ff9800",
        "#ff5722",
      ];

      let hash = 0;
      if (username?.length === 0) return hash;
      for (let i = 0; i < username.length; i++) {
        hash = username.charCodeAt(i) + ((hash << 5) - hash);
        hash = hash & hash;
      }
      hash = ((hash % colors.length) + colors.length) % colors.length;
      return colors[hash];
    };
  };

  return cursors;
};
