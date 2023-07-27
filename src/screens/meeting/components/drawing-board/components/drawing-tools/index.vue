<template>
  <div
    ref="container"
    class="drawing-tool"
    :style="`transform: translate(${point.x}px, ${point.y}px);`"
  >
    <div
      :class="[
        'drawing-item',
        drawingTool === drawingToolEnum.Cursor && 'active',
      ]"
      @click="() => onClick(drawingToolEnum.Cursor)"
    >
      <i class="iconfont icon-cursor" />
      <p class="title">鼠标</p>
    </div>
    <el-popover
      placement="top"
      :width="312"
      :offset="16"
      trigger="hover"
      popper-style="padding: 0;"
    >
      <template #reference>
        <div
          :class="[
            'drawing-item',
            drawingTool === drawingToolEnum.Brush && 'active',
          ]"
          @click="() => onClick(drawingToolEnum.Brush)"
        >
          <i class="iconfont icon-brush" />
          <p class="title">画笔</p>
        </div>
      </template>
      <BrushStatus />
    </el-popover>

    <div
      :class="[
        'drawing-item',
        drawingTool === drawingToolEnum.Eraser && 'active',
      ]"
      @click="() => onClick(drawingToolEnum.Eraser)"
    >
      <i class="iconfont icon-eraser" />
      <p class="title">橡皮擦</p>
    </div>

    <div class="divider" />

    <div
      :class="['drawing-item', undoDisabled && 'disabled']"
      @click="() => !undoDisabled && onAction(drawingToolEnum.Undo)"
    >
      <i class="iconfont icon-undo" />
      <p class="title">撤销</p>
    </div>
    <div
      :class="['drawing-item', redoDisabled && 'disabled']"
      @click="() => !redoDisabled && onAction(drawingToolEnum.Redo)"
    >
      <i class="iconfont icon-redo" />
      <p class="title">重做</p>
    </div>
    <div
      :class="['drawing-item', undoDisabled && 'disabled']"
      @click="() => !undoDisabled && onAction(drawingToolEnum.Clear)"
    >
      <i class="iconfont icon-delete" />
      <p class="title">清空</p>
    </div>
    <!-- <div class="drawing-item" @click="() => onAction(drawingToolEnum.Save)">
      <i class="iconfont icon-download" />
      <p class="title">保存</p>
    </div> -->
    <div class="close-btn" @click="onClose">
      <i class="iconfont icon-close" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { toRefs } from "vue";
import BrushStatus from "../brush-status/index.vue";
import { useAction, useDragg, Props, Emits } from "./hooks";

const props = defineProps<Props>();

const emits = defineEmits<Emits>();

const { drawingTool, undoDisabled, redoDisabled } = toRefs(props);

const { drawingToolEnum, onClick, onAction } = useAction(emits);

const { container, point } = useDragg();

const onClose = () => emits("close");
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
