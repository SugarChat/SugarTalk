import { nextTick, onMounted, onUnmounted, ref } from "vue";

const WIDTH = 176;

const MAX_WIDTH = 840;

export const useDraggResize = () => {
  const target = ref<HTMLDivElement>();

  const handle = ref<HTMLDivElement>();

  const clientX = ref(0);

  const width = ref(WIDTH);

  const mousedown = (event: MouseEvent) => {
    clientX.value = event.clientX;
    target.value!.classList.add("nuactive");

    document.addEventListener("mousemove", mousemove);
    document.addEventListener("mouseup", mouseup);
  };

  const mousemove = (event: MouseEvent | Touch) => {
    const moveX = clientX.value - event.clientX;
    clientX.value = event.clientX;
    const currentWidth = width.value + moveX;
    if (currentWidth > WIDTH && currentWidth < MAX_WIDTH) {
      width.value = currentWidth;
      target.value!.style.width = currentWidth + "px";
    }
  };

  const mouseup = () => {
    target.value!.classList.remove("nuactive");
    document.removeEventListener("mousemove", mousemove);
    document.removeEventListener("mouseup", mouseup);
  };

  onMounted(() => {
    nextTick(() => {
      handle.value?.addEventListener("mousedown", mousedown);
    });
  });

  onUnmounted(() => {
    handle.value?.removeEventListener("mousedown", mousedown);
  });

  return {
    width,
    target,
    handle,
  };
};

export const useAction = () => {
  const isExpand = ref(false);

  const onExpand = () => {
    isExpand.value = !isExpand.value;
  };

  return {
    isExpand,
    onExpand,
  };
};
