import { nextTick, onMounted, onUnmounted, reactive, ref } from "vue";
import { PaintTool } from "../../../../../../entity/enum";
import { Point } from "../../../../../../entity/types";

export interface Props {
  paintTool: PaintTool;
}

export interface Emits {
  (event: "change", paintTool: PaintTool): void;
  (event: "action", paintTool: PaintTool): void;
  (event: "close"): void;
}

export const useAction = (emits: Emits) => {
  const paintToolEnum = reactive(PaintTool);

  const paintToolList = ref([
    {
      title: "鼠标",
      value: PaintTool.Cursor,
      icon: "icon-cursor",
    },
    {
      title: "选择",
      value: PaintTool.Move,
      icon: "icon-move",
    },
    {
      title: "激光笔",
      value: PaintTool.Laser,
      icon: "icon-laser",
    },
    {
      title: "画笔",
      value: PaintTool.Brush,
      icon: "icon-brush",
    },
    {
      title: "文本",
      value: PaintTool.Text,
      icon: "icon-text",
    },
    {
      title: "图形",
      value: PaintTool.Graphical,
      icon: "icon-graphical",
    },
    {
      title: "橡皮擦",
      value: PaintTool.Eraser,
      icon: "icon-eraser",
    },
  ]);

  const onClick = (type: PaintTool) => emits("change", type);

  const onAction = (type: PaintTool) => emits("action", type);

  return {
    paintToolEnum,
    paintToolList,
    onClick,
    onAction,
  };
};

export const useDragg = () => {
  const container = ref<HTMLElement | null>(null);

  const point = reactive<Point>({ x: 0, y: 0 });

  const startPoint = reactive<Point>({ x: 0, y: 0 });

  const isDown = ref(false);

  const layout = reactive({ width: 699, height: 60 });

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

  onMounted(() => {
    nextTick(() => {
      layout.width = container.value?.clientWidth || layout.width;
      layout.height = container.value?.clientHeight || layout.height;
      point.x = (document.body.clientWidth - layout.width) / 2;
      point.y = document.body.clientHeight - 112;
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
