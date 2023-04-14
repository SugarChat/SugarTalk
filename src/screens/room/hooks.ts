import { onMounted, ref } from "vue";
import { ScreenSource } from "../../entity/types";

export const useAction = () => {
  const stream = ref<MediaStream>();

  const onScreenShare = async (source: ScreenSource) => {
    stream.value = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        mandatory: {
          chromeMediaSource: "desktop",
          chromeMediaSourceId: source?.id,
        },
      } as MediaTrackConstraints,
    });
  };

  onMounted(() => {
    window.electronAPI.onClose(
      {
        type: "info",
        title: "离开会议",
        message: "离开会议后，您仍可使用此会议号再次加入会议。",
        buttons: ["离开会议", "取消"],
        defaultId: 0,
        cancelId: 1,
      },
      () => {
        // 关闭窗口回调
      }
    );
  });

  return {
    stream,
    onScreenShare,
  };
};
