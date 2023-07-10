<template>
  <div ref="container" :class="['drawing-board']">
    <canvas ref="canvasEl" id="canvas"></canvas>
    <LaserPoint
      v-if="state.paintTool === paintToolEnum.Laser"
      :point="state.point"
    />
  </div>

  <ShareBar @togglePaintTool="togglePaintTool" />

  <PaintTool
    v-show="isShowPaintTool"
    :paintTool="state.paintTool"
    @change="onChange"
    @action="onAction"
    @close="closeaintTool"
  />
</template>

<script setup lang="ts">
import ShareBar from "./components/share-bar/index.vue";
import PaintTool from "./components/paint-tools/index.vue";
import LaserPoint from "./components/laser-point/index.vue";
import { useAction, useTools } from "./hooks";

const { container, canvasEl, paintToolEnum, state, onChange, onAction } =
  useAction();

const { isShowPaintTool, togglePaintTool, closeaintTool } = useTools();
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
