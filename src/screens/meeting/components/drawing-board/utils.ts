import { fabric } from "fabric";
import { Point, VideoSizeInfo } from "../../../../entity/types";

export class Drawing {
  canvas: fabric.Canvas;

  videoSizeInfo: VideoSizeInfo = {
    width: 0,
    height: 0,
    videoWidth: 0,
    videoHeight: 0,
    currentVideoWidth: 0,
    currentVideoHeight: 0,
    ratio: 0,
  };

  constructor(canvas: fabric.Canvas) {
    this.canvas = canvas;
  }

  clearContext() {
    this.canvas.clearContext(this.canvas.getContext());
  }

  remove(object?: fabric.Object) {
    object && this.canvas.remove(object);
  }

  resize(videoSizeInfo: VideoSizeInfo) {
    this.videoSizeInfo = videoSizeInfo;

    this.canvas.setWidth(videoSizeInfo.currentVideoWidth);
    this.canvas.setHeight(videoSizeInfo.currentVideoHeight);

    this.canvas.clear();
  }

  createPath(moveTo: Point, linesTo: Point[]) {
    const ctx = this.canvas.getContext();

    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.strokeStyle = "red";
    ctx.lineWidth = 2 * this.videoSizeInfo.ratio;

    ctx.beginPath();
    ctx.moveTo(moveTo.x, moveTo.y);
    linesTo.forEach((lineTo) => ctx.lineTo(lineTo.x, lineTo.y));
    ctx.stroke();
    ctx.closePath();
  }

  createFabricPath(points: Point[]) {
    this.canvas.getContext().closePath();
    const svgPath = this.pointsToSvgPath(points);
    const path = new fabric.Path(svgPath, {
      fill: "",
      selectable: false,
      stroke: "red",
      strokeWidth: 2 * this.videoSizeInfo.ratio,
      hoverCursor: "default",
    });
    this.canvas.add(path);
    this.canvas.renderAll();
    return path;
  }

  /**
   * 当前画布尺寸points转video原始尺寸points
   * @param points 坐标Point
   * @param ratio
   * @returns
   */
  currentConvertOriginalPoints(points: Point[]): Point[] {
    return points.map((point) => ({
      x: point.x / this.videoSizeInfo.ratio,
      y: point.y / this.videoSizeInfo.ratio,
    }));
  }

  /**
   * video原始尺寸points转当前画布尺寸points
   * @param points 坐标Point
   * @param ratio
   * @returns
   */
  originalConvertCurrentPoints(points: Point[]): Point[] {
    return points.map((point) => ({
      x: point.x * this.videoSizeInfo.ratio,
      y: point.y * this.videoSizeInfo.ratio,
    }));
  }

  pointsToSvgPath(points: Point[]) {
    let path = "";
    const startPoint = points[0];

    // 移动到起点
    path += "M " + startPoint.x + " " + startPoint.y + " ";

    // 遍历每个点，创建路径指令
    for (let i = 1; i < points.length; i++) {
      let point = points[i];
      path += "L " + point.x + " " + point.y + " ";
    }

    return path;
  }
}
