<template>
  <div
    class="avatar-container"
    :style="`--avatar-size: ${size}px;--avatar-cursor: ${cursor};--avatar-fit: ${fit};--avatar-font-size: ${fontSize}px;`"
  >
    <img v-if="src" class="avatar-img" :src="src" />
    <p v-else-if="char" class="avatar-nickname">{{ char }}</p>
    <i v-else class="iconfont icon-avatar" />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  src?: string;
  name?: string;
  size: number;
  cursor?: string;
  fit?: "fill" | "contain" | "cover" | "none" | "scale-down";
  fontSize?: number;
}

const { src, name, size, cursor, fit, fontSize } = withDefaults(
  defineProps<Props>(),
  {
    fit: "cover",
    fontSize: 20,
  }
);

const char = computed(() => (name && name.length > 0 ? name[0] : ""));
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
