<template>
  <div class="player">
    <video id="stream-media" :srcObject="stream" autoplay playsInline muted />
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { toRefs } from "vue";

interface Props {
  stream: MediaStream;
}

const props = defineProps<Props>();

const { stream } = toRefs(props);
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
