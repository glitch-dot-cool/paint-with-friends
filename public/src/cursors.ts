import { Socket } from "socket.io";
import { LeanDrawUpdate } from "../../types.js";
import { dimensions, EVENTS } from "./constants.js";
import { Camera } from "./utils/Camera.js";

type CursorsP5 = p5 & {
  usernameToColor: (username: string) => string;
  upsertUser: (
    socketId: string,
    username: string,
    x: number,
    y: number,
    color: string
  ) => void;
  drawCursor: (x: number, y: number, username: string, color: string) => void;
};

type User = { x: number; y: number; color: string; username: string };

type Users = {
  [userId: string]: User;
};

export const initCursors = (socket: Socket, camera: Camera) => {
  const cursors = (s: CursorsP5) => {
    const users: Users = {};

    s.setup = () => {
      const canvas = s.createCanvas(dimensions.width, dimensions.height);
      canvas.id("cursors");
      canvas.parent("p5-cursors");

      camera.registerCanvas(document.querySelector("#cursors")!, "cursors");

      s.textFont("JetBrains Mono");

      socket.on(EVENTS.DRAW_UPDATE, (data: LeanDrawUpdate) => {
        const [username, socketId, x, y] = data;
        const color = s.usernameToColor(username || socketId);
        s.upsertUser(socketId, username || socketId, x, y, color);
      });

      socket.on(EVENTS.MOUSE_RELEASED, (userId: string) => {
        delete users[userId];
      });
    };

    s.draw = () => {
      s.clear(0, 0, 0, 0);

      Object.keys(users).forEach((userId) => {
        const user = users[userId];
        if (user) {
          const { x, y, color, username } = user;
          s.drawCursor(x, y, username, color);
        }
      });
    };

    s.upsertUser = (socketId, username, x, y, color) => {
      users[socketId] = { x, y, color, username };
    };

    s.drawCursor = (x, y, username, color) => {
      // black bg
      s.fill(0, 200);
      s.rect(
        x + Camera.scaleByZoomAmount(8, camera.zoomAmount),
        y - Camera.scaleByZoomAmount(7, camera.zoomAmount),
        Camera.scaleByZoomAmount(7.25 * username.length, camera.zoomAmount),
        Camera.scaleByZoomAmount(12, camera.zoomAmount)
      );

      // cursor
      s.fill(color);
      s.noStroke();
      s.circle(x, y, Camera.scaleByZoomAmount(10, camera.zoomAmount));

      // username
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
      const defaultColor = colors[0];
      if (username?.length === 0 && defaultColor) return defaultColor;
      for (let i = 0; i < username.length; i++) {
        hash = username.charCodeAt(i) + ((hash << 5) - hash);
        hash = hash & hash;
      }
      hash = ((hash % colors.length) + colors.length) % colors.length;
      return colors[hash] || defaultColor!;
    };
  };

  return cursors;
};
