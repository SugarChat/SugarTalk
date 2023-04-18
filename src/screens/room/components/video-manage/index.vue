<template>
  <ActionBtn title="开启视频" icon="icon-video" @click="onClick" />
</template>

<script setup lang="ts">
import { useDebounceFn } from "@vueuse/core";
import { getMediaDeviceAccessAndStatus } from "../../../../utils/media";
import ActionBtn from "../action-btn/index.vue";
import { onMounted } from "vue";

onMounted(async () => {
  getMediaDeviceAccessAndStatus("camera");
});

const onClick = useDebounceFn(async () => {
  const pass = await getMediaDeviceAccessAndStatus("camera", true);
  if (pass) {
  }
}, 300);
</script>
