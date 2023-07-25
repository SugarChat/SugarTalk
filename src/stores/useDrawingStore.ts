import { defineStore } from "pinia";
import { Point, VideoSizeInfo } from "../entity/types";

export const useDrawingStore = defineStore("drawingStore", {
  state: () => ({
    videoWidth: 0, // 视频内容的原始宽度
    videoHeight: 0, // 视频内容的原始高度
    width: 0, // video标签的宽度
    height: 0, // video标签的高度
    currentVideoWidth: 0, // 视频内容的实际宽度
    currentVideoHeight: 0, // 视频内容的实际高度
    ratio: 0, // 视频内容实际高度 / 原始宽度 的比例
  }),
  actions: {
    setVideoSizeInfo(videoSizeInfo: VideoSizeInfo) {
      this.videoWidth = videoSizeInfo.videoWidth;
      this.videoHeight = videoSizeInfo.videoHeight;
      this.width = videoSizeInfo.width;
      this.height = videoSizeInfo.height;
      this.currentVideoWidth = videoSizeInfo.currentVideoWidth;
      this.currentVideoHeight = videoSizeInfo.currentVideoHeight;
      this.ratio = videoSizeInfo.ratio;
    },
    // 当前画布尺寸points转video原始尺寸points
    currentConvertOriginalPoints(points: Point[]) {
      return points.map((point) => ({
        x: point.x / this.ratio,
        y: point.y / this.ratio,
      }));
    },
    // video原始尺寸points转当前画布尺寸points
    originalConvertCurrentPoints(points: Point[]) {
      return points.map((point) => ({
        x: point.x * this.ratio,
        y: point.y * this.ratio,
      }));
    },
  },
});
