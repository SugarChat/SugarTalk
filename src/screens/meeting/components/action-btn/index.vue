<template>
  <div class="box-item" @click="onClick">
    <div :class="['box-icon', { disabled }]">
      <slot>
        <i :class="['iconfont', icon]" />
      </slot>
    </div>
    <p class="title">{{ title }}</p>
  </div>
</template>

<script setup lang="ts">
import { toRefs } from "vue";

interface Props {
  title: string;
  icon: string;
  disabled?: boolean;
}

interface Emits {
  (event: "click"): void;
}

const props = defineProps<Props>();

const { title, icon, disabled } = toRefs(props);

const emits = defineEmits<Emits>();

const onClick = () => emits("click");
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
