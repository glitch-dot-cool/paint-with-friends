export class Waveforms {
  static sine(min: number, x: number) {
    const expression = Math.sin(x);
    return this._normalize(expression, min);
  }

  static square(min: number, x: number) {
    if (this._tauMod(x) <= Math.PI) {
      return this._normalize(-1, min);
    }
    return this._normalize(1, min);
  }

  static triangle(min: number, x: number) {
    const value = this._tauMod(x);
    if (value <= Math.PI) {
      const expression = value / (Math.PI * 0.5) - 1;
      return this._normalize(expression, min);
    }

    const expression = (value - Math.PI) / (-Math.PI * 0.5) + 1;
    return this._normalize(expression, min);
  }

  static saw(min: number, x: number) {
    const expression = this._tauMod(x) / Math.PI - 1;
    return this._normalize(expression, min);
  }

  static random(min: number) {
    const expression = Math.random() * 2 - 1;
    return this._normalize(expression, min);
  }

  static noise(min: number, x: number) {
    const expression = window.p5.prototype.noise(x);
    return this._normalize(expression, min);
  }

  //  Normalizes a range of -1 to 1 to 0 to 1.
  static _normalize(x: number, min: number) {
    const scaledMin = min * 0.01;
    return window.p5.prototype.map(x, -1, 1, scaledMin, 1);
  }

  //  Mods an input value by tau, used in constant waveforms.
  static _tauMod(x: number) {
    return (x %= Math.PI * 2);
  }
}
