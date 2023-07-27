<template>
  <div ref="containerEl" class="laser-point">
    <div
      class="point"
      :style="`transform: translate(${point.x}px, ${point.y}px);`"
    />
  </div>
</template>

<script setup lang="ts">
import { useAction } from "./hooks";

const { containerEl, point } = useAction();
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
