<template>
  <el-tooltip effect="light" :content="source.name" placement="bottom">
    <div :class="['screen', active && 'active']" @click="onClick">
      <el-image
        style="width: 120px; height: 68px"
        :src="source.thumbnail"
        fit="contain"
      />
      <p class="title">{{ source.name }}</p>
      <el-image
        v-if="source.appIcon"
        class="app-icon"
        :src="source.appIcon"
        fit="contain"
      />
    </div>
  </el-tooltip>
</template>

<script setup lang="ts">
import { ScreenSource } from "../../../../../../entity/types";

interface Props {
  source: ScreenSource;
  active?: boolean;
}

interface Emits {
  (event: "click", source: ScreenSource): void;
}

const { source, active } = defineProps<Props>();

const emits = defineEmits<Emits>();

const onClick = () => emits("click", source);
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
