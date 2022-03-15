import { dimensions, EVENTS } from "./constants.js";

export const initCursors = (socket) => {
  const cursors = (s) => {
    let color;

    s.setup = () => {
      const canvas = s.createCanvas(dimensions.width, dimensions.height);
      canvas.parent("p5-cursors");

      s.textFont("JetBrains Mono");

      socket.on(EVENTS.DRAW_UPDATE, (data) => {
        // first 2 elements of lean paint proerties are current mouse coords
        const [x, y] = data;
        // last element is username
        const username = data[data.length - 1];
        color = s.usernameToColor(username);
        // color = s.color(s.usernameToColor(username));
        s.drawCursor(x, y, username);
      });
    };

    s.drawCursor = (x, y, username) => {
      s.clear();
      s.fill(color);
      s.noStroke();
      s.circle(x, y, 10);

      s.stroke(0);
      s.strokeWeight(2);
      s.text(username, x + 8, y + 3);
    };

    s.usernameToColor = (username) => {
      var colors = [
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
      if (username.length === 0) return hash;
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
