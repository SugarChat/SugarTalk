<template>
  <ActionBtn title="静音" icon="icon-mic" disabled @click="onClick" />
</template>

<script setup lang="ts">
import { useDebounceFn } from "@vueuse/core";
import { getMediaDeviceAccessAndStatus } from "../../../../utils/media";
import ActionBtn from "../action-btn/index.vue";
import { onMounted } from "vue";

onMounted(async () => {
  getMediaDeviceAccessAndStatus("microphone");
});

const onClick = useDebounceFn(async () => {
  const pass = await getMediaDeviceAccessAndStatus("microphone", true);
  if (pass) {
  }
}, 300);
</script>
