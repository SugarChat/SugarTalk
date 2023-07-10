<template>
  <div
    ref="container"
    class="paint-tool"
    :style="`transform: translate(${point.x}px, ${point.y}px);`"
  >
    <div
      v-for="item in paintToolList"
      :key="item.value"
      :class="['paint-item', paintTool === item.value && 'active']"
      @click="() => onClick(item.value)"
    >
      <i :class="['iconfont', item.icon]" />
      <p class="title">{{ item.title }}</p>
    </div>

    <div class="divider" />

    <div
      :class="['paint-item', 'disabled']"
      @click="() => onAction(paintToolEnum.Undo)"
    >
      <i class="iconfont icon-undo" />
      <p class="title">撤销</p>
    </div>
    <div
      :class="['paint-item', 'disabled']"
      @click="() => onAction(paintToolEnum.Redo)"
    >
      <i class="iconfont icon-redo" />
      <p class="title">重做</p>
    </div>
    <div
      :class="['paint-item', 'disabled']"
      @click="() => onAction(paintToolEnum.Clear)"
    >
      <i class="iconfont icon-delete" />
      <p class="title">清空</p>
    </div>
    <div class="paint-item" @click="() => onAction(paintToolEnum.Save)">
      <i class="iconfont icon-download" />
      <p class="title">保存</p>
    </div>
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

const { paintTool } = toRefs(props);

const { paintToolEnum, paintToolList, onClick, onAction } = useAction(emits);

const { container, point } = useDragg();

const onClose = () => emits("close");
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
