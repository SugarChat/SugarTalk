import { onMounted, ref } from "vue";
import { useSettingsStore } from "../../../../stores/useSettingsStore";
import loudness from "../../../../utils/loudness";
import manageDevices from "../../../../utils/manage-devices";
import { AudioManage } from "./audio-manage";

interface MediaDeviceInfo {
  deviceId: string;
  groupId: string;
  kind: MediaDeviceKind;
  label: string;
}

export const useAction = () => {
  const settingsStore = useSettingsStore();

  const audioOutputDevices = ref<MediaDeviceInfo[]>([
    {
      deviceId: "default",
      groupId: "",
      kind: "audiooutput",
      label: "系统默认",
    },
  ]);

  const audioManage = ref(new AudioManage());

  const setVolume = async (volume: number) => {
    settingsStore.volume = volume;
    loudness.setVolume(volume);
  };

  const setMuted = () => {
    const muted = !settingsStore.muted;
    settingsStore.muted = muted;
    loudness.setMuted(muted);
  };

  const onPlay = () => {
    const audioContext = new AudioContext();
    window.electronAPI.getLocalAudioArrayBuffer().then((arraybuffer) => {
      audioContext.decodeAudioData(arraybuffer, (buffer) => {
        const source = audioContext.createBufferSource();
        source.buffer = buffer;
        source.loop = true;
        audioContext.setSinkId(settingsStore.audioOutputDeviceId);
        source.connect(audioContext.destination);
        source.start();
      });
    });
  };

  const getAudioOutputDevices = () => {
    manageDevices.getAudioOutputDevices().then((devices) => {
      if (devices.length > 0) {
        audioOutputDevices.value = devices.map((device) => ({
          deviceId: device.deviceId,
          groupId: device.groupId,
          kind: device.kind,
          label: device.deviceId === "default" ? "系统默认" : device.label,
        }));
        if (
          !devices.some(
            (device) => device.deviceId === settingsStore.audioOutputDeviceId
          ) &&
          settingsStore.audioOutputDeviceId !== "default"
        ) {
          settingsStore.audioOutputDeviceId = "default";
        }
      } else {
        settingsStore.audioOutputDeviceId = "default";
      }
    });
  };

  onMounted(() => {
    getAudioOutputDevices();
  });

  return {
    settingsStore,
    audioOutputDevices,
    setVolume,
    setMuted,
    onPlay,
  };
};
