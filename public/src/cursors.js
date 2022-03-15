import { dimensions, EVENTS } from "./constants.js";

export const initCursors = (socket) => {
  const cursors = (s) => {
    s.setup = () => {
      const canvas = s.createCanvas(dimensions.width, dimensions.height);
      canvas.parent("p5-cursors");

      socket.on(EVENTS.DRAW_UPDATE, (data) => {
        // first 2 elements of lean paint proerties are current mouse coords
        const [x, y] = data;
        // last element is username
        const username = data[data.length - 1];
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
