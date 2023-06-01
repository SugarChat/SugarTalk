<template>
  <el-tooltip
    effect="light"
    :content="isFullscreen ? '退出全屏模式' : '进入全屏模式'"
    placement="bottom"
  >
    <div
      class="fullscreen-container"
      @click="() => (isFullscreen ? onExit() : onEnter())"
    >
      <i
        :class="`iconfont ${
          isFullscreen ? 'icon-fullscreen-exit' : 'icon-fullscreen'
        }`"
      />
    </div>
  </el-tooltip>
</template>

<script setup lang="ts">
import { useFullscreen } from "./hooks";

const { isFullscreen, onExit, onEnter } = useFullscreen();
</script>

<style scoped lang="scss">
.fullscreen-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  margin-left: 12px;
  border: var(--border-width-base) solid var(--border-color-base);
  cursor: pointer;
}
</style>
