<template>
  <div class="join-btn" @click="onClick">
    <div class="btn-box">
      <i :class="`iconfont ${icon}`" />
    </div>
    <div class="title">{{ title }}</div>
  </div>
</template>

<script setup lang="ts">
import { toRefs } from "vue";

interface Props {
  icon: string;
  title: string;
}

interface Emits {
  (event: "click"): void;
}

const emits = defineEmits<Emits>();

const props = defineProps<Props>();

const { icon, title } = toRefs(props);

const onClick = () => emits("click");
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
