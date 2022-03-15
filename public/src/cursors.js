import { dimensions, EVENTS } from "./constants.js";

export const initCursors = (socket) => {
  const cursors = (s) => {
    s.setup = () => {
      const canvas = s.createCanvas(dimensions.width, dimensions.height);
      canvas.parent("p5-cursors");

      socket.on(EVENTS.CURSOR_UPDATE, ({ x, y, username }) => {
        s.drawCursor(x, y, username);
      });
    };

    s.drawCursor = (x, y, username) => {
      s.clear();
      s.fill(0, 255, 0);
      s.circle(x, y, 10);
      s.text(username, x + 8, y + 3);
    };
  };

  return cursors;
};
