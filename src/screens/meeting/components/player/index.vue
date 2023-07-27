<template>
  <div class="player">
    <video
      ref="videoRef"
      id="stream-media"
      :srcObject="stream"
      autoplay
      playsInline
      muted
    />
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { toRefs } from "vue";
import { Emits, useAction } from "./hooks";

interface Props {
  stream: MediaStream;
}

const props = defineProps<Props>();

const emits = defineEmits<Emits>();

const { stream } = toRefs(props);

const { videoRef } = useAction(emits);
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
