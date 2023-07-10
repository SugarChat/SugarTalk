import { nextTick, onMounted, onUnmounted, ref } from "vue";
import { Point } from "../../../../../../entity/types";

export const useAction = () => {
  const containerEl = ref<HTMLDivElement>();

  const point = ref<Point>({ x: 0, y: 0 });

  const mousemove = (e: MouseEvent) =>
    (point.value = { x: e.offsetX, y: e.offsetY });

  onMounted(() => {
    nextTick(() => {
      containerEl.value?.addEventListener("mousemove", mousemove);
    });
  });

  onUnmounted(() => {
    containerEl.value?.removeEventListener("mousemove", mousemove);
  });

  return {
    containerEl,
    point,
  };
};
