class Loudness {
  getVolume() {
    return window.loudness.getVolume();
  }

  setVolume(volume: number) {
    return window.loudness.setVolume(volume);
  }

  async getMuted() {
    return window.loudness.getMuted();
  }

  setMuted(muted: boolean) {
    return window.loudness.setMuted(muted);
  }

  getStatus() {
    return Promise.all([this.getVolume(), this.getMuted()]);
  }
}

export default new Loudness();
