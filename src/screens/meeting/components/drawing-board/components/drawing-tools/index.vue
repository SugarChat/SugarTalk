<template>
  <div
    ref="container"
    class="drawing-tool"
    :style="`transform: translate(${point.x}px, ${point.y}px);`"
  >
    <div
      v-for="item in drawingToolList"
      :key="item.value"
      :class="['drawing-item', drawingTool === item.value && 'active']"
      @click="() => onClick(item.value)"
    >
      <i :class="['iconfont', item.icon]" />
      <p class="title">{{ item.title }}</p>
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
import { useAction, useDragg, Props, Emits } from "./hooks";

const props = defineProps<Props>();

const emits = defineEmits<Emits>();

const { drawingTool, undoDisabled, redoDisabled } = toRefs(props);

const { drawingToolEnum, drawingToolList, onClick, onAction } =
  useAction(emits);

const { container, point } = useDragg();

const onClose = () => emits("close");
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
