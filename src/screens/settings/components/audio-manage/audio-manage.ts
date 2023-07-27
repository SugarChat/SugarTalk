export class AudioManage {
  context: AudioContext = new AudioContext();

  source?: AudioBufferSourceNode;

  buffer?: AudioBuffer;

  isPlay = false;

  constructor() {
    window.electronAPI.getLocalAudioArrayBuffer().then((arraybuffer) => {
      this.context.decodeAudioData(arraybuffer, (buffer) => {
        this.buffer = buffer;
      });
    });
  }

  createBufferSource() {
    if (this.buffer) {
      this.source = this.context.createBufferSource();
      this.source.buffer = this.buffer;
      this.source.loop = true;
      this.source.connect(this.context.destination);
    }
    return this;
  }

  setSinkId(sinkId: string) {
    this.context.setSinkId(sinkId);
    return this;
  }

  start() {
    if (this.isPlay) return;
    this.isPlay = true;
    this.createBufferSource();
    this.source?.start();
    return this;
  }

  stop() {
    this.isPlay = false;
    this.source?.stop();
    this.source?.disconnect();
    this.source = undefined;
    return this;
  }
}
