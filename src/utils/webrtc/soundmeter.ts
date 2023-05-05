export class SoundMeter {
  context: AudioContext;

  scritp: ScriptProcessorNode;

  instant = 0.0;

  mic?: MediaStreamAudioSourceNode;

  constructor(context: AudioContext, callback?: (instant: number) => void) {
    this.context = context;
    this.scritp = context.createScriptProcessor(2048, 1, 1);
    this.scritp.onaudioprocess = (event) => {
      const input = event.inputBuffer.getChannelData(0);
      let i = 0;
      let sum = 0.0;

      for (; i < input.length; i++) {
        sum += input[i] * input[i];
      }

      this.instant = Math.sqrt(sum / input.length);
      callback?.(this.instant);
    };
  }

  connectToSource(stream: MediaStream) {
    this.mic = this.context.createMediaStreamSource(stream);
    this.mic.connect(this.scritp);
    this.scritp.connect(this.context.destination);
  }

  stop() {
    this.mic?.disconnect();
    this.scritp.disconnect();
  }

  audioprocess() {}
}
