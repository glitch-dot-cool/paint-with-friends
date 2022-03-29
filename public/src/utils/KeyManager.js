import { toggleDrawMode } from "./drawing.js";
import { state } from "../initialState.js";

export class KeyManager {
  constructor(p5) {
    this.keysPressed = [];

    this.commandsDict = {
      screenshot: [17, 88], // ctrl/cmd + x
      toggleDrawMode: [16], // shift
    };

    this.commands = new Map([
      [
        JSON.stringify(this.commandsDict.screenshot),
        { execute: p5.save.bind(p5), params: ["paint with friends.png"] },
      ],
      [
        JSON.stringify(this.commandsDict.toggleDrawMode),
        { execute: toggleDrawMode, params: [state] },
      ],
    ]);
  }

  addKey = (key) => {
    this.keysPressed.push(key);
    this._checkForValidCommand();
  };

  removeKey = (key) => {
    this.keysPressed = this.keysPressed.filter((k) => k !== key);
  };

  purge = () => {
    this.keysPressed = [];
  };

  _checkForValidCommand = () => {
    const command = this.commands.get(JSON.stringify(this.keysPressed));
    if (command) {
      command.execute(...command.params);
    }
  };
}
