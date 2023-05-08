export class SoundMeter {
  context: AudioContext;

  scritp: ScriptProcessorNode;

  instant = 0.0;

  mic?: MediaStreamAudioSourceNode;

  /**
   * 频谱解析器
   */
  analyser?: AnalyserNode;

  constructor(
    context: AudioContext,
    streamId: string,
    callback?: (streamId: string, instant: number) => void
  ) {
    this.context = context;
    this.scritp = context.createScriptProcessor(4096, 1, 1);
    this.scritp.onaudioprocess = (event) => {
      // const dataArray = new Uint8Array(10);
      // this.analyser?.getByteTimeDomainData(dataArray);
      // console.log(dataArray);

      const input = event.inputBuffer.getChannelData(0);
      let i = 0;
      let sum = 0.0;

      for (; i < input.length; i++) {
        sum += input[i] * input[i];
      }

      this.instant = Math.sqrt(sum / input.length);
      callback?.(streamId, this.instant);
    };
  }

  connectToSource(stream: MediaStream) {
    this.mic = this.context.createMediaStreamSource(stream);
    this.mic.connect(this.scritp);
    this.scritp.connect(this.context.destination);

    this.analyser = this.mic.context.createAnalyser();
    this.mic.connect(this.analyser);
    this.analyser.connect(this.scritp);
    this.analyser.fftSize = 4096;
    this.analyser.getByteFrequencyData(new Uint8Array(4096));
  }

  stop() {
    this.mic?.disconnect();
    this.scritp.disconnect();
  }

  audioprocess() {}
}
