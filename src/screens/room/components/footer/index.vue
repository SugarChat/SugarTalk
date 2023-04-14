<template>
  <div class="footer">
    <div class="footer-left">
      <ActionBtn title="静音" icon="icon-mic" disabled />
      <OpenVideo />
    </div>

    <div class="footer-content">
      <ScreenShare :click="screenShare" />
    </div>

    <div class="footer-right">
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toRefs } from "vue";
import { ScreenSource } from "../../../../entity/types";
import ActionBtn from "../action-btn/index.vue";
import ScreenShare from "../screen-share/index.vue";
import OpenVideo from "../open-video/index.vue";

interface Props {
  screenShare?: (source: ScreenSource) => void;
}

const props = defineProps<Props>();

const { screenShare } = toRefs(props);
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
