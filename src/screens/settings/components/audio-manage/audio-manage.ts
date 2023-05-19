export class AudioManage {
  audioContext: AudioContext;

  source?: AudioBufferSourceNode;

  constructor() {
    this.audioContext = new AudioContext();
  }

  createBufferSource(options?: AudioBufferSourceOptions) {
    this.source?.disconnect();
    this.source = new AudioBufferSourceNode(this.audioContext, options);
    this.source.connect(this.audioContext.destination);
    return this;
  }

  setSinkId(sinkId: string) {
    this.audioContext.setSinkId(sinkId);
    return this;
  }
}
