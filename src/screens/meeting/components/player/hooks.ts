import { useResizeObserver } from "@vueuse/core";
import { nextTick, onMounted, ref } from "vue";
import { VideoSizeInfo } from "../../../../entity/types";

export interface Emits {
  (event: "update", videoSizeInfo: VideoSizeInfo): void;
}

export const useAction = (emits: Emits) => {
  const videoRef = ref<HTMLVideoElement>();

  const videoSizeInfo = {
    width: 0,
    height: 0,
    videoWidth: 0,
    videoHeight: 0,
    currentVideoWidth: 0,
    currentVideoHeight: 0,
    aspectRatio: 0,
  };

  const update = () => {
    const { width, height, videoWidth, videoHeight } = videoSizeInfo;

    const aspectRatio = videoWidth / videoHeight;
    let currentVideoWidth, currentVideoHeight;

    if (width / height > aspectRatio) {
      currentVideoWidth = height * aspectRatio;
      currentVideoHeight = height;
    } else {
      currentVideoWidth = width;
      currentVideoHeight = width / aspectRatio;
    }

    emits("update", {
      width,
      height,
      videoWidth: videoRef.value!.videoWidth,
      videoHeight: videoRef.value!.videoHeight,
      currentVideoWidth,
      currentVideoHeight,
      aspectRatio: currentVideoWidth / videoWidth,
    });
  };

  useResizeObserver(videoRef, (entries) => {
    const entry = entries[0];
    const { width, height } = entry.contentRect;
    videoSizeInfo.width = width;
    videoSizeInfo.height = height;
    if (
      videoRef.value &&
      videoRef.value.videoWidth > 0 &&
      videoRef.value.videoHeight > 0
    ) {
      update();
    }
  });

  onMounted(() => {
    nextTick(() => {
      videoRef.value?.addEventListener("loadeddata", () => {
        const { videoWidth, videoHeight } = videoRef.value!;
        videoSizeInfo.videoWidth = videoWidth;
        videoSizeInfo.videoHeight = videoHeight;
        update();
      });
    });
  });

  return {
    videoRef,
  };
};
