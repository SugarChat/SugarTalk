import { nextTick, onMounted, reactive, ref, toRaw } from "vue";
import { useToggle } from "@vueuse/core";
import { fabric } from "fabric";
import { DrawingTool, DrawingStep } from "../../../../entity/enum";
import { DrawingRecord, Point, VideoSizeInfo } from "../../../../entity/types";
import { Drawing } from "./utils";
import { v4 as uuidv4 } from "uuid";
import { Emits } from "./props";
import { useAppStore } from "../../../../stores/useAppStore";
import { useDrawingStore } from "../../../../stores/useDrawingStore";

export const useAction = (emits: Emits) => {
  const appStore = useAppStore();

  const drawingStore = useDrawingStore();

  const container = ref<HTMLDivElement>();

  const canvasEl = ref<HTMLCanvasElement>();

  const drawing = ref<Drawing>();

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
    drawingTool: DrawingTool.Brush,
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
    size: 0,
    color: "",
    points: [],
    step: DrawingStep.Start,
  };

  const resize = (videoSizeInfo: VideoSizeInfo) => {
    drawing.value!.resize(videoSizeInfo);
    state.historyDrawingRecords.forEach((record) => {
      const points = drawing.value!.originalConvertCurrentPoints(record.points);
      const path = drawing.value!.createFabricPath(
        points,
        record.size,
        record.color
      );
      record.fabric = path;
    });
  };

  const onDrawing = (drawingRecord: DrawingRecord) =>
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
          size: drawingStore.lineSize,
          color: drawingStore.lineColor,
          points: [],
          step: DrawingStep.Start,
        };
        const points = drawing.value!.currentConvertOriginalPoints([point]);
        onDrawing({ ...currentRecord, points });
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
          drawing.value!.canvas.add(text);
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
            drawing.value!.remove(drawingRecord.fabric);
            // 添加到撤销记录中
            state.undoDrawingRecords.push(toRaw(drawingRecord));
            // 通知其他人撤销
            onDrawing({
              id: drawingRecord.id,
              userId: drawingRecord.userId,
              tool: DrawingTool.Eraser,
              size: 0,
              color: "",
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
      drawing.value!.createPath(prevPoint, [{ ...point }]);
      currentRecord.step = DrawingStep.Process;
      currentRecord.points.push({ ...point });
      requestAnimationFrame(() => {
        if (currentRecord.points.length > 0) {
          const points = currentRecord.points.map((point) => ({ ...point }));
          onDrawing({
            ...currentRecord,
            points: drawing.value!.currentConvertOriginalPoints(points),
          });
          currentRecord.points = [];
        }
      });
    }
  };

  const mouseup = (e: fabric.IEvent<MouseEvent>) => {
    if (state.drawingTool === DrawingTool.Brush) {
      state.isDrawing = false;

      drawing.value?.clearContext();
      const path = drawing.value!.createFabricPath(state.points);

      requestAnimationFrame(() => {
        currentRecord.step = DrawingStep.End;

        const points = drawing.value!.currentConvertOriginalPoints(
          toRaw(state.points).map((point) => ({ ...point }))
        );
        onDrawing({
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

  onMounted(() => {
    nextTick(() => {
      const canvas = new fabric.Canvas("canvas", {
        skipTargetFind: true,
        isDrawingMode: false,
        selection: false,
      });
      canvas.on("mouse:down", mousedown);
      canvas.on("mouse:move", mousemove);
      canvas.on("mouse:up", mouseup);
      drawing.value = new Drawing(canvas);
    });
  });

  const onChange = (drawingTool: DrawingTool) => {
    state.drawingTool = drawingTool;
    drawing.value!.canvas.skipTargetFind = true;
    switch (drawingTool) {
      case DrawingTool.Eraser:
        drawing.value!.canvas.skipTargetFind = false;
        break;
    }
  };

  const onAction = (drawingTool: DrawingTool) => {
    drawing.value!.canvas.skipTargetFind = true;
    switch (drawingTool) {
      case DrawingTool.Undo: {
        const drawingRecord = state.historyDrawingRecords.pop();
        if (drawingRecord && drawingRecord.fabric) {
          // 从画板上删除
          drawing.value!.remove(drawingRecord.fabric);
          // 添加到撤销记录中
          state.undoDrawingRecords.push(toRaw(drawingRecord));
          onDrawing({
            ...drawingRecord,
            drawingTool: drawingRecord.tool,
            tool: DrawingTool.Undo,
            fabric: undefined,
          });
        }
        return;
      }
      case DrawingTool.Redo: {
        const drawingRecord = state.undoDrawingRecords.pop();
        if (drawingRecord && drawingRecord.fabric) {
          // 添加到画板上
          const points = drawing.value!.originalConvertCurrentPoints(
            drawingRecord.points
          );
          const path = drawing.value!.createFabricPath(
            points,
            drawingRecord.size,
            drawingRecord.color
          );
          drawingRecord.fabric = path;
          // 添加到历史记录中
          state.historyDrawingRecords.push(toRaw(drawingRecord));
          onDrawing({
            ...drawingRecord,
            drawingTool: drawingRecord.tool,
            tool: DrawingTool.Redo,
            fabric: undefined,
          });
        }
        return;
      }
      case DrawingTool.Clear: {
        drawing.value!.canvas.clear();
        state.undoDrawingRecords = [];
        state.historyDrawingRecords = [];
        onDrawing({
          id: uuidv4(),
          userId: appStore.userInfo.id,
          tool: DrawingTool.Clear,
          size: 0,
          color: "",
          points: [],
          step: DrawingStep.End,
        });
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
              const startPoint = drawing.value!.originalConvertCurrentPoints([
                record.points[record.points.length - 1],
              ])[0];
              const movePoints =
                drawing.value!.originalConvertCurrentPoints(points);
              drawing.value!.createPath(
                startPoint,
                movePoints,
                record.size,
                record.color
              );
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
              drawing.value!.clearContext();
              const points = drawing.value!.originalConvertCurrentPoints(
                drawingRecord.points
              );
              const path = drawing.value!.createFabricPath(
                points,
                record.size,
                record.color
              );

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
          drawing.value?.canvas.remove(record.fabric);
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
          switch (record.tool) {
            case DrawingTool.Brush: {
              state.undoDrawingRecords = state.undoDrawingRecords.filter(
                (record) => record.id !== drawingRecord.id
              );
              // 添加到画板上
              const points = drawing.value!.originalConvertCurrentPoints(
                drawingRecord.points
              );
              const path = drawing.value!.createFabricPath(
                points,
                record.size,
                record.color
              );
              record.fabric = path;
              // 添加到历史记录中
              state.historyDrawingRecords.push(toRaw(record));
              return;
            }
          }
        } else {
          switch (drawingRecord.drawingTool) {
            case DrawingTool.Brush: {
              const points = drawing.value!.originalConvertCurrentPoints(
                drawingRecord.points
              );
              const path = drawing.value!.createFabricPath(
                points,
                drawingRecord.size,
                drawingRecord.color
              );
              drawingRecord.fabric = path;
              state.historyDrawingRecords.push(drawingRecord);
              return;
            }
          }
        }
        return;
      }
      case DrawingTool.Clear: {
        drawing.value!.canvas.clear();
        state.undoDrawingRecords = [];
        state.historyDrawingRecords = [];
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
