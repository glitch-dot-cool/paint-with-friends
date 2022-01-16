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
    this.checkForValidCommand();
  };

  removeKey = (key) => {
    this.keysPressed = this.keysPressed.filter((key) => key !== key);
  };

  checkForValidCommand = () => {
    this.commands.forEach((command) => {
      if (this.arrayEquals(command.keys, this.keysPressed)) {
        command.execute(command.param);
      }
    });
  };

  arrayEquals = (a, b) => {
    return a.every((val, idx) => val === b[idx]);
  };
}
