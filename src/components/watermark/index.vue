<template>
  <div class="watermark">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

interface Props {
  text: string;
}

const props = defineProps<Props>();

const rotateWithCenter = (
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D
) => {
  const width = canvas.width / 2;
  const height = canvas.height / 2;
  context.translate(width, height);
  context.rotate((-45 * Math.PI) / 180);
  context.translate(-width, -height);
};

const getMark = () => {
  const canvas = document.createElement("canvas");
  canvas.width = 200;
  canvas.height = 200;

  const context = canvas.getContext("2d")!;
  rotateWithCenter(canvas, context);
  context.font = "18px Arial";
  context.fillStyle = "rgba(218, 218, 218, 0.40)";

  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(
    props.text,
    canvas.width / 2,
    canvas.height / 2,
    canvas.width
  );

  return canvas.toDataURL("image/png");
};

const bgImage = ref(`url(${getMark()})`);
</script>

<style scoped>
.watermark {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: v-bind(bgImage) left top repeat;
  z-index: 99;
  pointer-events: none;
}
</style>
