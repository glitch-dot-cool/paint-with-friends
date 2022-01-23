export class Waveforms {
  static sine(x) {
    return this._normalize(Math.sin(x));
  }

  static square(x) {
    if (x <= Math.PI) {
      return 0;
    }
    return 1;
  }

  static triangle(x) {
    if (x <= Math.PI) {
      return this._normalize(x / (Math.PI * 0.5) - 1);
    }
    return this._normalize((x - Math.PI) / (-Math.PI * 0.5) + 1);
  }

  static saw(x) {
    return this._normalize(x / Math.PI - 1);
  }

  static random() {
    return Math.random();
  }

  /**
   * Normalizes a range of -1 to 1 to 0 to 1.
   *
   * @param {number} x
   * @returns {number} - 0-1 range
   */
  static _normalize(x) {
    return window.p5.prototype.map(x, -1, 1, 0, 1);
  }
}
