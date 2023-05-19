class ManageDevices {
  getDevices() {
    return navigator.mediaDevices.enumerateDevices();
  }

  getAudioOutputDevices() {
    return this.getDevices().then((devices) =>
      devices.filter((device) => device.kind === "audiooutput")
    );
  }

  getAudioInputDevices() {
    return this.getDevices().then((devices) =>
      devices.filter((device) => device.kind === "audioinput")
    );
  }
}

export default new ManageDevices();
