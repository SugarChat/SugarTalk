<template>
  <el-tooltip effect="light" content="参会时长" placement="bottom">
    <div class="meeting-duration">{{ duration }}</div>
  </el-tooltip>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useInterval } from "@vueuse/core";

const counter = useInterval(1000);

const format = (num: number) => (num < 10 ? `0${num}` : `${num}`);

const duration = computed(() => {
  const hour = Math.floor((counter.value / 3600) % 24);
  const minute = Math.floor((counter.value / 60) % 60);
  const second = Math.floor(counter.value % 60);
  const hourStr = hour > 0 ? `${format(hour)}:` : "";
  return `${hourStr}${format(minute)}:${format(second)}`;
});
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
