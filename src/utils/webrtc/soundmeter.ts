export class SoundMeter {
  context: AudioContext;

  mic: MediaStreamAudioSourceNode;

  analyser: AnalyserNode;

  dataArray: Uint8Array = new Uint8Array();

  constructor(context: AudioContext, stream: MediaStream) {
    this.context = context;
    this.mic = this.context.createMediaStreamSource(stream);
    this.analyser = this.context.createAnalyser();
    this.mic.connect(this.analyser);
    this.analyser.fftSize = 256;
    this.analyser.minDecibels = -90;
    this.analyser.maxDecibels = -10;
    this.analyser.smoothingTimeConstant = 0.85;
    this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
  }

  getByteFrequencyData() {
    this.analyser.getByteFrequencyData(this.dataArray);
  }

  stop() {
    this.mic.disconnect();
    this.analyser.disconnect();
  }
}
