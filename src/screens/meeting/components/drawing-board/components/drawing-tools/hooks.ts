import {
  nextTick,
  onMounted,
  onUnmounted,
  reactive,
  ref,
  watchEffect,
} from "vue";
import { DrawingTool } from "../../../../../../entity/enum";
import { Point } from "../../../../../../entity/types";
import { useResizeObserver, useWindowSize } from "@vueuse/core";

export interface Props {
  drawingTool: DrawingTool;
  undoDisabled: boolean;
  redoDisabled: boolean;
}

export interface Emits {
  (event: "change", drawingTool: DrawingTool): void;
  (event: "action", drawingTool: DrawingTool): void;
  (event: "close"): void;
}

export const useAction = (emits: Emits) => {
  const drawingToolEnum = reactive(DrawingTool);

  const drawingToolList = ref([
    {
      title: "鼠标",
      value: DrawingTool.Cursor,
      icon: "icon-cursor",
    },
    // {
    //   title: "选择",
    //   value: DrawingTool.Move,
    //   icon: "icon-move",
    // },
    {
      title: "激光笔",
      value: DrawingTool.Laser,
      icon: "icon-laser",
    },
    {
      title: "画笔",
      value: DrawingTool.Brush,
      icon: "icon-brush",
    },
    // {
    //   title: "文本",
    //   value: DrawingTool.Text,
    //   icon: "icon-text",
    // },
    // {
    //   title: "图形",
    //   value: DrawingTool.Graphical,
    //   icon: "icon-graphical",
    // },
    {
      title: "橡皮擦",
      value: DrawingTool.Eraser,
      icon: "icon-eraser",
    },
  ]);

  const onClick = (type: DrawingTool) => emits("change", type);

  const onAction = (type: DrawingTool) => emits("action", type);

  return {
    drawingToolEnum,
    drawingToolList,
    onClick,
    onAction,
  };
};

export const useDragg = () => {
  const container = ref<HTMLElement | null>(null);

  const point = reactive<Point>({ x: 0, y: 0 });

  const startPoint = reactive<Point>({ x: 0, y: 0 });

  const isDown = ref(false);

  const isInit = ref(false);

  const layout = reactive({ width: 699, height: 60 });

  const { width, height } = useWindowSize();

  useResizeObserver(container, (entries) => {
    const entry = entries[0];
    const { width, height } = entry.contentRect;

    if (width > 0 && height > 0 && !isInit.value) {
      isInit.value = true;
      point.x = (document.body.clientWidth - width) / 2;
      point.y = document.body.clientHeight - 112;
    }

    layout.width = width;
    layout.height = height;
  });

  const mousedown = (event: MouseEvent) => {
    isDown.value = true;
    startPoint.x = event.x;
    startPoint.y = event.y;
    document.addEventListener("mousemove", mousemove);
    document.addEventListener("mouseup", mouseup);
  };

  const mousemove = (event: MouseEvent) => {
    if (!isDown.value) return;
    const x = event.x - startPoint.x;
    const y = event.y - startPoint.y;
    const moveX = Math.floor(point.x + x);
    if (moveX >= 0 && moveX < document.body.clientWidth - layout.width) {
      point.x = moveX;
    }
    const moveY = Math.floor(point.y + y);
    if (moveY >= 0 && moveY < document.body.clientHeight - layout.height) {
      point.y = moveY;
    }
    startPoint.x = event.x;
    startPoint.y = event.y;
  };

  const mouseup = () => {
    isDown.value = false;
    document.removeEventListener("mousemove", mousemove);
    document.removeEventListener("mouseup", mouseup);
  };

  watchEffect(() => {
    if (point.y + layout.height > height.value - 2) {
      point.y = height.value - layout.height - 2;
    }
    if (point.x + layout.width > width.value - 2) {
      point.x = width.value - layout.width - 2;
    }
  });

  onMounted(() => {
    nextTick(() => {
      container.value?.addEventListener("mousedown", mousedown);
    });
  });

  onUnmounted(() => {
    container.value?.removeEventListener("mousedown", mousedown);
  });

  return {
    container,
    point,
  };
};
