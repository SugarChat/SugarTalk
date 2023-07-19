import { onMounted, reactive, ref, watchEffect } from "vue";
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

  const state = reactive({
    frameCount: 0,
    isPlay: audioManage.value.isPlay,
  });

  watchEffect(() => {
    const audioOutputDeviceId =
      settingsStore.audioOutputDeviceId === "default"
        ? ""
        : settingsStore.audioOutputDeviceId;
    audioManage.value.setSinkId(audioOutputDeviceId);
  });

  const setVolume = async (volume: number) => {
    settingsStore.volume = volume;
    state.frameCount = 3;
    loudness.setVolume(volume);
  };

  const setMuted = () => {
    const muted = !settingsStore.muted;
    settingsStore.muted = muted;
    loudness.setMuted(muted);
  };

  const onPlay = () => {
    if (audioManage.value.isPlay) {
      audioManage.value.stop();
    } else {
      audioManage.value.start();
    }
    state.isPlay = audioManage.value.isPlay;
  };

  const getAudioOutputDevices = async () => {
    await manageDevices.getAudioOutputDevices().then((devices) => {
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

  const loop = () => {
    requestAnimationFrame(() => {
      loudness.getStatus().then(([volume, muted]) => {
        if (state.frameCount > 0) {
          state.frameCount--;
        } else {
          settingsStore.muted = muted;
          settingsStore.volume = volume;
        }
        loop();
      });
    });
  };

  onMounted(() => {
    getAudioOutputDevices();
    loop();
  });

  return {
    state,
    settingsStore,
    audioOutputDevices,
    setVolume,
    setMuted,
    onPlay,
  };
};
