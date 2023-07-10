import { nextTick, onMounted, reactive, ref, watchEffect } from "vue";
import { useElementSize, useToggle } from "@vueuse/core";
import { fabric } from "fabric";
import { PaintTool } from "../../../../entity/enum";
import { Point } from "../../../../entity/types";
import { pointsToSvgPath } from "./utils";

class Draw {
  canvasEl: HTMLCanvasElement;

  ctx: CanvasRenderingContext2D;

  isDrawing = false;

  startPoint: Point = { x: 0, y: 0 };

  constructor(el: HTMLCanvasElement) {
    this.canvasEl = el;

    this.ctx = el.getContext("2d")!;

    this.listen();
  }

  listen() {
    this.canvasEl.addEventListener("mousedown", this.mousedown.bind(this));
    this.canvasEl.addEventListener("mousemove", this.mousemove.bind(this));
    this.canvasEl.addEventListener("mouseleave", this.mouseup.bind(this));
    this.canvasEl.addEventListener("mouseup", this.mouseup.bind(this));
  }

  mousedown(ev: MouseEvent) {
    this.isDrawing = true;
    this.startPoint = { x: ev.offsetX, y: ev.offsetY };
  }

  mousemove(ev: MouseEvent) {
    if (!this.isDrawing) return;
    const endPoint: Point = { x: ev.offsetX, y: ev.offsetY };
    this.draw(this.startPoint, endPoint);
    this.startPoint = endPoint;
  }

  mouseup(ev: MouseEvent) {
    this.isDrawing = false;
  }

  draw(moveTo: Point, lineTo: Point) {
    const { ctx } = this;

    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(moveTo.x, moveTo.y);
    ctx.lineTo(lineTo.x, lineTo.y);
    ctx.stroke();
    ctx.closePath();
  }
}

export const useAction2 = () => {
  const container = ref<HTMLDivElement>();

  const canvasEl = ref<HTMLCanvasElement>();

  const draw = ref<Draw>();

  const { width, height } = useElementSize(container);

  watchEffect(() => {
    if (width.value > 0 && height.value > 0) {
      canvasEl.value!.width = width.value;
      canvasEl.value!.height = height.value;
    }
  });

  onMounted(() => {
    nextTick(() => {
      // draw.value = new Draw(canvasEl.value!);
    });
  });

  return {
    container,
    canvasEl,
  };
};

export const useAction = () => {
  const container = ref<HTMLDivElement>();

  const canvasEl = ref<HTMLCanvasElement>();

  const canvas = ref<fabric.Canvas>();

  const pointFrom = ref<Point>();

  const paintToolEnum = reactive(PaintTool);

  const textElement = ref<fabric.Textbox>();

  const state = reactive<{
    paintTool: PaintTool;
    isDrawing: boolean;
    point: Point;
    points: Point[];
  }>({
    paintTool: PaintTool.Cursor,
    isDrawing: false,
    point: { x: 0, y: 0 },
    points: [],
  });

  const { width, height } = useElementSize(container);

  watchEffect(() => {
    canvas.value?.setWidth(width.value);
    canvas.value?.setHeight(height.value);
    canvas.value?.renderAll();
    canvas.value?.calcOffset();
    canvas.value?.requestRenderAll();
  });

  const mousedown = (e: fabric.IEvent<MouseEvent>) => {
    const x = e.pointer!.x,
      y = e.pointer!.y;
    state.point = { x, y };
    if (state.paintTool === PaintTool.Brush) {
      state.isDrawing = true;
      pointFrom.value = e.pointer;
      state.points = [{ x: e.pointer?.x!, y: e.pointer!.y }];
    } else if (state.paintTool === PaintTool.Text) {
      if (textElement.value) {
        textElement.value.exitEditing();
        textElement.value.hiddenTextarea?.blur();
        textElement.value = undefined;
      } else {
        const text = new fabric.Textbox("", {
          left: x,
          top: y,
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
  };

  const mousemove = (e: fabric.IEvent<MouseEvent>) => {
    state.point = { x: e.pointer!.x, y: e.pointer!.y };
    if (state.paintTool === PaintTool.Brush) {
      if (!state.isDrawing) return;
      draw(pointFrom.value!, e.pointer!);
      pointFrom.value = e.pointer;
      state.points.push({ x: e.pointer?.x!, y: e.pointer!.y });
    }
  };

  const mouseup = (e: fabric.IEvent<MouseEvent>) => {
    if (state.paintTool === PaintTool.Brush) {
      state.isDrawing = false;
      canvas.value!.getContext().closePath();
      const svgPath = pointsToSvgPath(state.points);
      const path = new fabric.Path(svgPath, {
        fill: "",
        selectable: false,
        stroke: "red",
        strokeWidth: 2,
        hoverCursor: "default",
      });
      canvas.value?.clearContext(canvas.value!.getContext());
      canvas.value?.add(path!);
      canvas.value?.renderAll();
      path!.setCoords();
    }
  };

  const draw = (moveTo: Point, lineTo: Point) => {
    const ctx = canvas.value!.getContext();

    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(moveTo.x, moveTo.y);
    ctx.lineTo(lineTo.x, lineTo.y);
    ctx.stroke();
    ctx.closePath();
  };

  onMounted(() => {
    nextTick(() => {
      canvas.value = new fabric.Canvas("canvas", {
        isDrawingMode: false,
        selection: false,
        // hoverCursor: "none",
        // defaultCursor: "none",
      });
      canvas.value.on("mouse:down", mousedown);
      canvas.value.on("mouse:move", mousemove);
      canvas.value.on("mouse:up", mouseup);
    });
  });

  const onChange = (paintTool: PaintTool) => {
    state.paintTool = paintTool;
    switch (paintTool) {
      case PaintTool.Laser:
        console.log("设置激光笔");
        // canvas.value?.defaultCursor()
        break;
    }
  };

  const onAction = (paintTool: PaintTool) => {};

  return {
    container,
    canvasEl,
    paintToolEnum,
    state,
    onChange,
    onAction,
  };
};

export const useTools = () => {
  const [isShowPaintTool, togglePaintTool] = useToggle(false);

  const closeaintTool = () => togglePaintTool(false);

  return {
    isShowPaintTool,
    togglePaintTool,
    closeaintTool,
  };
};
