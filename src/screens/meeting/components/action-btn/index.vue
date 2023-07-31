<template>
  <div class="box-item" @click="onClick">
    <div :class="['box-icon', { disabled }]">
      <slot>
        <i :class="['iconfont', icon]" />
      </slot>
    </div>
    <p class="title">{{ title }}</p>
    <div v-if="badge" class="badge">{{ badge }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed, toRefs } from "vue";

interface Props {
  title: string;
  icon: string;
  disabled?: boolean;
  count?: number;
}

interface Emits {
  (event: "click"): void;
}

const props = defineProps<Props>();

const { title, icon, disabled, count } = toRefs(props);

const emits = defineEmits<Emits>();

const badge = computed(() =>
  count?.value ? (count.value > 99 ? "99+" : `${count.value}`) : ""
);

const onClick = () => emits("click");
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
