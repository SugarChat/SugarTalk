import { useResizeObserver } from "@vueuse/core";
import { nextTick, onMounted, ref } from "vue";
import { VideoSizeInfo } from "../../../../entity/types";
import { useDrawingStore } from "../../../../stores/useDrawingStore";

export interface Emits {
  (event: "update", videoSizeInfo: VideoSizeInfo): void;
}

export const useAction = (emits: Emits) => {
  const drawingStore = useDrawingStore();

  const videoRef = ref<HTMLVideoElement>();

  const videoSizeInfo = {
    width: 0,
    height: 0,
    videoWidth: 0,
    videoHeight: 0,
    currentVideoWidth: 0,
    currentVideoHeight: 0,
    ratio: 0,
  };

  const update = () => {
    const { width, height, videoWidth, videoHeight } = videoSizeInfo;

    const aspectRatio = videoWidth / videoHeight;

    if (width / height > aspectRatio) {
      videoSizeInfo.currentVideoWidth = height * aspectRatio;
      videoSizeInfo.currentVideoHeight = height;
    } else {
      videoSizeInfo.currentVideoWidth = width;
      videoSizeInfo.currentVideoHeight = width / aspectRatio;
    }

    videoSizeInfo.ratio = videoSizeInfo.currentVideoWidth / videoWidth;

    drawingStore.setVideoSizeInfo(videoSizeInfo);
    emits("update", videoSizeInfo);
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
