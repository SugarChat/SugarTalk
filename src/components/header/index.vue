<template>
  <div :class="['header', borderBottom ? 'border-bottom' : '']">
    <slot name="left"></slot>
    <slot>
      <span class="title">{{ title }}</span>
    </slot>
    <slot name="right"></slot>
  </div>
</template>

<script setup lang="ts">
import { toRefs } from "vue";

interface Props {
  title?: string;
  borderBottom?: boolean;
}

const props = defineProps<Props>();

const { title, borderBottom } = toRefs(props);
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
