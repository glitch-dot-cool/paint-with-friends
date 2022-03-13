export class KeyManager {
  constructor(p5) {
    this.keysPressed = [];
    this.commands = [
      {
        name: "screenshot",
        keys: [17, 88], // ctrl + x
        execute: p5.save.bind(p5),
        param: "paint with friends.png",
      },
    ];
  }

  addKey = (key) => {
    this.keysPressed.push(key);
    this._checkForValidCommand();
  };

  removeKey = (key) => {
    this.keysPressed = this.keysPressed.filter((k) => k !== key);
  };

  _checkForValidCommand = () => {
    this.commands.forEach((command) => {
      if (this._arrayEquals(command.keys, this.keysPressed)) {
        command.execute(command.param);
      }
    });
  };

  _arrayEquals = (a, b) => {
    return a.every((val, idx) => val === b[idx]);
  };
}
