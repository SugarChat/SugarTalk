<template>
  <div class="brush-container">
    <div class="size-list">
      <div
        :class="['size-item', size === drawingStore.lineSize && 'active']"
        v-for="size in sizes"
        :key="size"
        @click="() => (drawingStore.lineSize = size)"
      >
        <div class="size" :style="`width: ${size}px`" />
      </div>
    </div>
    <div class="color-list">
      <div
        :class="['color-item', color === drawingStore.lineColor && 'active']"
        v-for="color in colors"
        :key="color"
        @click="() => (drawingStore.lineColor = color)"
      >
        <div class="color" :style="`background-color: ${color}`" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDrawingStore } from "../../../../../../stores/useDrawingStore";

const drawingStore = useDrawingStore();

const sizes = [3, 6, 9, 12, 15];

const colors = [
  "#000000",
  "#939699",
  "#e62222",
  "#fd6a0e",
  "#f7b500",
  "#14bf50",
  "#44d7b6",
  "#146fff",
  "#6236ff",
];
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
