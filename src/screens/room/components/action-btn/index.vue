<template>
  <div class="box-item" @click="onClick">
    <div :class="['box-icon', { disabled: disabled }]">
      <i :class="['iconfont', icon]" />
    </div>
    <p class="title">{{ title }}</p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string;
  icon: string;
  disabled?: boolean;
}

interface Emits {
  (event: "click"): void;
}

const { title, icon, disabled } = defineProps<Props>();

const emits = defineEmits<Emits>();

const onClick = () => emits("click");
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
