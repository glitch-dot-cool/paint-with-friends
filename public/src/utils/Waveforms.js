export class Waveforms {
  static sine(min, x) {
    const expression = Math.sin(x);
    return this._normalize(expression, min);
  }

  static square(min, x) {
    if (x <= Math.PI) {
      return this._normalize(-1, min);
    }
    return this._normalize(1, min);
  }

  static triangle(min, x) {
    if (x <= Math.PI) {
      const expression = x / (Math.PI * 0.5) - 1;
      return this._normalize(expression, min);
    }

    const expression = (x - Math.PI) / (-Math.PI * 0.5) + 1;
    return this._normalize(expression, min);
  }

  static saw(min, x) {
    const expression = x / Math.PI - 1;
    return this._normalize(expression, min);
  }

  static random(min) {
    const expression = Math.random() * 2 - 1;
    return this._normalize(expression, min);
  }

  static noise(min, x) {
    const expression = window.p5.prototype.noise(x);
    return this._normalize(expression, min);
  }

  /**
   * Normalizes a range of -1 to 1 to 0 to 1.
   *
   * @param {number} x
   * @returns {number} - 0-1 range
   */
  static _normalize(x, min) {
    const scaledMin = min * 0.01;
    return window.p5.prototype.map(x, -1, 1, scaledMin, 1);
  }
}
