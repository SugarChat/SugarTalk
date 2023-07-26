<template>
  <div ref="container" class="drawing-board">
    <canvas ref="canvasEl" id="canvas"></canvas>
    <!-- 激光笔 -->
    <LaserPoint v-if="state.drawingTool === drawingToolEnum.Laser" />
  </div>

  <ShareBar @toggle-drawing-tool="toggleDrawingTool" />

  <DrawingTool
    v-show="isShowDrawingTool"
    :drawing-tool="state.drawingTool"
    :undo-disabled="state.historyDrawingRecords.length === 0"
    :redo-disabled="state.undoDrawingRecords.length === 0"
    @change="onChange"
    @action="onAction"
    @close="closeaintTool"
  />
</template>

<script setup lang="ts">
import ShareBar from "./components/share-bar/index.vue";
import DrawingTool from "./components/drawing-tools/index.vue";
import LaserPoint from "./components/laser-point/index.vue";
import { useAction, useTools } from "./hooks";
import { Emits } from "./props";

const emits = defineEmits<Emits>();

const {
  container,
  canvasEl,
  drawingToolEnum,
  state,
  drawing,
  onChange,
  onAction,
  remoteDrawing,
  resize,
} = useAction(emits);

const { isShowDrawingTool, toggleDrawingTool, closeaintTool } = useTools();

defineExpose({
  drawing: remoteDrawing,
  resize,
});
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
