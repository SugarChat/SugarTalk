<template>
  <div
    :class="[
      'header',
      borderBottom && 'border-bottom',
      props?.isInner && 'inner',
    ]"
  >
    <div class="left">
      <template v-if="isMac">
        <slot name="traffic-light">
          <template v-if="props?.isInner">
            <div class="close-btn-container">
              <div class="close-btn" @click="props?.close">
                <i class="iconfont icon-close" />
              </div>
            </div>
          </template>
        </slot>
      </template>
      <slot name="left"></slot>
    </div>
    <slot>
      <span class="title">{{ title }}</span>
    </slot>
    <div class="right">
      <slot name="right"></slot>

      <template v-if="isWin">
        <slot name="traffic-light">
          <template v-if="props?.isInner">
            <div class="btn-close" @click="props?.close">
              <i class="iconfont icon-close" />
            </div>
          </template>

          <template v-else>
            <TrafficLight
              :hide-minimizable="props.hideMinimizable"
              :hide-maximizable="props.hideMaximizable"
              :is-destroy="props.isDestroy"
              :close="props.close"
            />
          </template>
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
  isInner?: boolean;
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

const isMac = computed(() => appStore.appInfo.platform === "mac");

const { title, borderBottom } = toRefs(props);
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
