<template>
  <div
    :class="['join-btn', disabled && 'disabled', highlight && 'highlight']"
    @click="onClick"
  >
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
  disabled?: boolean;
  highlight?: boolean;
}

interface Emits {
  (event: "click"): void;
}

const emits = defineEmits<Emits>();

const props = defineProps<Props>();

const { icon, title, disabled, highlight } = toRefs(props);

const onClick = () => !disabled.value && emits("click");
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
