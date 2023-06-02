<template>
  <div :class="['header', borderBottom ? 'border-bottom' : '']">
    <slot name="left"></slot>
    <slot>
      <span class="title">{{ title }}</span>
    </slot>
    <div class="right">
      <slot name="right"></slot>
      <template v-if="isWin">
        <slot name="traffic-light">
          <TrafficLight
            :hide-minimizable="props.hideMinimizable"
            :hide-maximizable="props.hideMaximizable"
            :is-destroy="props.isDestroy"
            :close="props.close"
          />
        </slot>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toRefs } from "vue";
import TrafficLight from "../traffic-light/index.vue";
import { useAppStore } from "../../stores/useAppStore";
import { computed } from "vue";

interface Props {
  title?: string;
  borderBottom?: boolean;
  hideMinimizable?: boolean;
  hideMaximizable?: boolean;
  isDestroy?: boolean;
  close?: () => void;
}

const props = defineProps<Props>();

const appStore = useAppStore();

const isWin = computed(() => appStore.appInfo.platform === "win");

const { title, borderBottom } = toRefs(props);
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
