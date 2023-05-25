<template>
  <div class="screen-share-tabs">
    <div
      :class="['tab-item', currentAppIcon === '' && 'active']"
      @click="() => onClick('')"
    >
      <p class="tab-all">全部</p>
    </div>
    <div
      :class="['tab-item', currentAppIcon === appIcon && 'active']"
      v-for="appIcon in appIcons"
      :key="appIcon"
      @click="() => onClick(appIcon)"
    >
      <img class="app-logo" :src="appIcon" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { toRefs } from "vue";

interface Props {
  appIcons: string[];
  currentAppIcon: string;
}

interface Emits {
  (event: "click", appIcon: string): void;
}

const props = defineProps<Props>();

const emits = defineEmits<Emits>();

const { appIcons, currentAppIcon } = toRefs(props);

const onClick = (appIcon: string) => emits("click", appIcon);
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
