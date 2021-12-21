export class Waveforms {
  static sine(x) {
    return Math.sin(x);
  }

  static square(x) {
    if (x <= Math.PI) {
      return -1;
    }
    return 1;
  }

  static triangle(x) {
    if (x <= Math.PI) {
      return x / (Math.PI * 0.5) - 1;
    }
    return (x - Math.PI) / (-Math.PI * 0.5) + 1;
  }

  static saw(x) {
    return x / Math.PI - 1;
  }

  static random() {
    return Math.random() * 2 - 1;
  }
}
