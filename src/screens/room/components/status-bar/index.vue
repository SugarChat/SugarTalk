<template>
  <div class="status-bar">
    <div class="center"></div>
    <div class="right">
      <el-tooltip
        effect="light"
        :content="isFullscreen ? '退出全屏模式' : '进入全屏模式'"
        placement="bottom"
      >
        <div
          class="box left"
          @click="() => (isFullscreen ? onExit() : onEnter())"
        >
          <i
            :class="`iconfont ${
              isFullscreen ? 'icon-fullscreen-exit' : 'icon-fullscreen'
            }`"
          />
        </div>
      </el-tooltip>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useFullscreen } from "./hooks";

const { isFullscreen, onExit, onEnter } = useFullscreen();
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
