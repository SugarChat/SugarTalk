import { nextTick, onMounted, reactive, ref, toRaw } from "vue";
import { useToggle } from "@vueuse/core";
import { fabric } from "fabric";
import { DrawingTool, DrawingStep } from "../../../../entity/enum";
import { DrawingRecord, Point, VideoSizeInfo } from "../../../../entity/types";
import { pointsToSvgPath } from "./utils";
import { v4 as uuidv4 } from "uuid";
import { Emits } from "./props";
import { useAppStore } from "../../../../stores/useAppStore";
import { useDrawingStore } from "../../../../stores/useDrawingStore";

export const useAction = (emits: Emits) => {
  const appStore = useAppStore();

  const drawingStore = useDrawingStore();

  const container = ref<HTMLDivElement>();

  const canvasEl = ref<HTMLCanvasElement>();

  const canvas = ref<fabric.Canvas>();

  const drawingToolEnum = reactive(DrawingTool);

  const textElement = ref<fabric.Textbox>();

  const state = reactive<{
    drawingTool: DrawingTool;
    isDrawing: boolean;
    point: Point;
    points: Point[];
    historyDrawingRecords: DrawingRecord[];
    undoDrawingRecords: DrawingRecord[];
  }>({
    drawingTool: DrawingTool.Cursor,
    isDrawing: false,
    point: { x: 0, y: 0 }, // 鼠标down之后的鼠标Point
    points: [], // 鼠标down到up的Points
    historyDrawingRecords: [], // 历史记录
    undoDrawingRecords: [], // 撤销记录
  });

  // 当前帧的画笔Points
  let currentRecord: DrawingRecord = {
    id: "",
    userId: appStore.userInfo.id,
    tool: DrawingTool.Brush,
    points: [],
    step: DrawingStep.Start,
  };

  const resize = (videoSizeInfo: VideoSizeInfo) => {
    const { currentVideoWidth, currentVideoHeight } = videoSizeInfo;

    canvas.value?.setWidth(currentVideoWidth);
    canvas.value?.setHeight(currentVideoHeight);
    state.historyDrawingRecords.forEach((record) => {
      record?.fabric && canvas.value?.remove(record.fabric);
      const points = drawingStore.originalConvertCurrentPoints(record.points);
      canvas.value!.getContext().closePath();
      const svgPath = pointsToSvgPath(points);
      const path = new fabric.Path(svgPath, {
        fill: "",
        selectable: false,
        stroke: "red",
        strokeWidth: 2 * drawingStore.ratio,
        hoverCursor: "default",
      });
      console.log(points);
      canvas.value?.add(path);
      canvas.value?.renderAll();
      record.fabric = path;
    });
    // canvas.value?.renderAll();
    // canvas.value?.calcOffset();
    // canvas.value?.requestRenderAll();
  };

  const drawing = (drawingRecord: DrawingRecord) =>
    emits("drawing", drawingRecord);

  const mousedown = (e: fabric.IEvent<MouseEvent>) => {
    const point: Point = { x: e.pointer!.x, y: e.pointer!.y };
    state.point = { ...point };
    state.points = [{ ...point }];
    switch (state.drawingTool) {
      case DrawingTool.Brush: {
        state.isDrawing = true;
        currentRecord = {
          id: uuidv4(),
          userId: appStore.userInfo.id,
          tool: DrawingTool.Brush,
          points: [],
          step: DrawingStep.Start,
        };
        const points = drawingStore.currentConvertOriginalPoints([point]);
        drawing({ ...currentRecord, points });
        return;
      }
      case DrawingTool.Text: {
        if (textElement.value) {
          textElement.value.exitEditing();
          textElement.value.hiddenTextarea?.blur();
          textElement.value = undefined;
        } else {
          const text = new fabric.Textbox("", {
            left: point.x,
            top: point.y,
            width: 150,
            fontSize: 20,
            editable: true,
            editingBorderColor: "#FF0000",
            hasBorders: true,
            borderColor: "#FF0000",
            hasControls: true,
            selectable: false,
          });
          canvas.value?.add(text);
          text.enterEditing();
          text.hiddenTextarea?.focus();
          textElement.value = text;
        }
      }
      case DrawingTool.Eraser: {
        if (e.target) {
          const drawingRecord = state.historyDrawingRecords.find(
            (record) => toRaw(record.fabric) === e.target
          );
          if (drawingRecord && drawingRecord.fabric) {
            // 移除当前记录
            state.historyDrawingRecords = state.historyDrawingRecords.filter(
              (record) => record.id !== drawingRecord.id
            );
            // 从画板上删除
            canvas.value?.remove(drawingRecord.fabric);
            // 添加到撤销记录中
            state.undoDrawingRecords.push(toRaw(drawingRecord));
            // 通知其他人撤销
            drawing({
              id: drawingRecord.id,
              userId: drawingRecord.userId,
              tool: DrawingTool.Eraser,
              points: drawingRecord.points,
              step: drawingRecord.step,
            });
          }
        }
        return;
      }
    }
  };

  const mousemove = (e: fabric.IEvent<MouseEvent>) => {
    const point: Point = { x: e.pointer!.x, y: e.pointer!.y };
    const prevPoint = toRaw(state.point);
    state.point = { ...point };
    state.points.push({ ...point });
    if (state.drawingTool === DrawingTool.Brush) {
      if (!state.isDrawing) return;
      draw(prevPoint, [{ ...point }]);
      currentRecord.step = DrawingStep.Process;
      currentRecord.points.push({ ...point });
      requestAnimationFrame(() => {
        if (currentRecord.points.length > 0) {
          const points = currentRecord.points.map((point) => ({ ...point }));
          drawing({
            ...currentRecord,
            points: drawingStore.currentConvertOriginalPoints(points),
          });
          currentRecord.points = [];
        }
      });
    }
  };

  const mouseup = (e: fabric.IEvent<MouseEvent>) => {
    if (state.drawingTool === DrawingTool.Brush) {
      state.isDrawing = false;
      canvas.value!.getContext().closePath();
      const svgPath = pointsToSvgPath(state.points);
      const path = new fabric.Path(svgPath, {
        fill: "",
        selectable: false,
        stroke: "red",
        strokeWidth: 2 * drawingStore.ratio,
        hoverCursor: "default",
      });
      canvas.value?.clearContext(canvas.value!.getContext());
      canvas.value?.add(path);
      canvas.value?.renderAll();
      requestAnimationFrame(() => {
        currentRecord.step = DrawingStep.End;
        const points = drawingStore.currentConvertOriginalPoints(
          toRaw(state.points).map((point) => ({ ...point }))
        );
        drawing({
          ...currentRecord,
          points,
        });
        state.historyDrawingRecords.push({
          ...currentRecord,
          points,
          fabric: path,
        });
      });
    }
  };

  const draw = (moveTo: Point, linesTo: Point[]) => {
    const ctx = canvas.value!.getContext();

    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.strokeStyle = "red";
    ctx.lineWidth = 2 * drawingStore.ratio;

    ctx.beginPath();
    ctx.moveTo(moveTo.x, moveTo.y);
    linesTo.forEach((lineTo) => ctx.lineTo(lineTo.x, lineTo.y));
    ctx.stroke();
    ctx.closePath();
  };

  onMounted(() => {
    nextTick(() => {
      canvas.value = new fabric.Canvas("canvas", {
        skipTargetFind: true,
        isDrawingMode: false,
        selection: false,
      });
      canvas.value.on("mouse:down", mousedown);
      canvas.value.on("mouse:move", mousemove);
      canvas.value.on("mouse:up", mouseup);
    });
  });

  const onChange = (drawingTool: DrawingTool) => {
    state.drawingTool = drawingTool;
    canvas.value!.skipTargetFind = true;
    switch (drawingTool) {
      case DrawingTool.Eraser:
        canvas.value!.skipTargetFind = false;
        break;
    }
  };

  const onAction = (drawingTool: DrawingTool) => {
    canvas.value!.skipTargetFind = true;
    switch (drawingTool) {
      case DrawingTool.Undo: {
        const drawingRecord = state.historyDrawingRecords.pop();
        if (drawingRecord && drawingRecord.fabric) {
          // 从画板上删除
          canvas.value?.remove(drawingRecord.fabric);
          // 添加到撤销记录中
          state.undoDrawingRecords.push(toRaw(drawingRecord));
          drawing({
            id: drawingRecord.id,
            userId: drawingRecord.userId,
            tool: DrawingTool.Undo,
            points: drawingRecord.points,
            step: drawingRecord.step,
          });
        }
        return;
      }
      case DrawingTool.Redo: {
        const drawingRecord = state.undoDrawingRecords.pop();
        if (drawingRecord && drawingRecord.fabric) {
          // 添加到画板上
          canvas.value?.add(drawingRecord.fabric);
          canvas.value?.renderAll();
          // 添加到历史记录中
          state.historyDrawingRecords.push(toRaw(drawingRecord));
          drawing({
            id: drawingRecord.id,
            userId: drawingRecord.userId,
            tool: DrawingTool.Redo,
            points: drawingRecord.points,
            step: drawingRecord.step,
          });
        }
        return;
      }
      case DrawingTool.Clear: {
        state.historyDrawingRecords.forEach(
          (record) => record.fabric && canvas.value?.remove(record.fabric)
        );
        state.undoDrawingRecords.push(...state.historyDrawingRecords);
        state.historyDrawingRecords = [];
        return;
      }
    }
  };

  const remoteDrawing = (drawingRecord: DrawingRecord) => {
    switch (drawingRecord.tool) {
      case DrawingTool.Brush: {
        switch (drawingRecord.step) {
          case DrawingStep.Start: {
            state.historyDrawingRecords.push(drawingRecord);
            return;
          }
          case DrawingStep.Process: {
            const record = state.historyDrawingRecords.find(
              (record) => record.id === drawingRecord.id
            );
            if (record) {
              const points = drawingRecord.points.map((point) => ({
                ...point,
              }));
              const startPoint = drawingStore.originalConvertCurrentPoints([
                record.points[record.points.length - 1],
              ])[0];
              const movePoints =
                drawingStore.originalConvertCurrentPoints(points);
              draw(startPoint, movePoints);
              record.step = drawingRecord.step;
              record.points.push(...points);
            } else {
              state.historyDrawingRecords.push(drawingRecord);
            }
            return;
          }
          case DrawingStep.End: {
            const record = state.historyDrawingRecords.find(
              (record) => record.id === drawingRecord.id
            );
            if (record) {
              canvas.value!.getContext().closePath();
              const points = drawingStore.originalConvertCurrentPoints(
                drawingRecord.points
              );
              const svgPath = pointsToSvgPath(points);
              const path = new fabric.Path(svgPath, {
                fill: "",
                selectable: false,
                stroke: "red",
                strokeWidth: 2,
                hoverCursor: "default",
              });
              canvas.value?.clearContext(canvas.value!.getContext());
              canvas.value?.add(path);
              canvas.value?.renderAll();
              record.points = drawingRecord.points;
              record.step = drawingRecord.step;
              record.fabric = path;
            }
            return;
          }
        }
      }
      case DrawingTool.Eraser:
      case DrawingTool.Undo: {
        const record = state.historyDrawingRecords.find(
          (record) => record.id === drawingRecord.id
        );
        if (record && record.fabric) {
          // 移除当前记录
          state.historyDrawingRecords = state.historyDrawingRecords.filter(
            (record) => record.id !== drawingRecord.id
          );
          // 从画板上删除
          canvas.value?.remove(record.fabric);
          // 添加到撤销记录中
          state.undoDrawingRecords.push(toRaw(record));
        }
        return;
      }
      case DrawingTool.Redo: {
        const record = state.undoDrawingRecords.find(
          (record) => record.id === drawingRecord.id
        );
        if (record && record.fabric) {
          state.undoDrawingRecords = state.undoDrawingRecords.filter(
            (record) => record.id !== drawingRecord.id
          );
          // 添加到画板上

          canvas.value!.getContext().closePath();
          const points = drawingStore.originalConvertCurrentPoints(
            drawingRecord.points
          );
          console.log("ratio", drawingStore.ratio);
          const svgPath = pointsToSvgPath(points);
          const path = new fabric.Path(svgPath, {
            fill: "",
            selectable: false,
            stroke: "red",
            strokeWidth: 2,
            hoverCursor: "default",
          });
          canvas.value?.clearContext(canvas.value!.getContext());
          canvas.value?.add(path);
          canvas.value?.renderAll();
          record.fabric = path;
          // 添加到历史记录中
          state.historyDrawingRecords.push(toRaw(record));
        } else {
          canvas.value!.getContext().closePath();
          const points = drawingStore.originalConvertCurrentPoints(
            drawingRecord.points
          );
          const svgPath = pointsToSvgPath(points);
          const path = new fabric.Path(svgPath, {
            fill: "",
            selectable: false,
            stroke: "red",
            strokeWidth: 2,
            hoverCursor: "default",
          });
          canvas.value?.add(path);
          canvas.value?.renderAll();
          drawingRecord.fabric = path;
          state.historyDrawingRecords.push(drawingRecord);
        }
        return;
      }
    }
  };

  return {
    container,
    canvasEl,
    drawingToolEnum,
    state,
    onChange,
    onAction,
    remoteDrawing,
    resize,
  };
};

export const useTools = () => {
  const [isShowDrawingTool, toggleDrawingTool] = useToggle(false);

  const closeaintTool = () => toggleDrawingTool(false);

  return {
    isShowDrawingTool,
    toggleDrawingTool,
    closeaintTool,
  };
};
