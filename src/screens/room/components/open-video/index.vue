<template>
  <ActionBtn title="开启视频" icon="icon-video" />
</template>

<script setup lang="ts">
import ActionBtn from "../action-btn/index.vue";
import { onMounted } from "vue";

onMounted(async () => {
  // const devices = await navigator.mediaDevices.enumerateDevices();
  // console.log({ devices });
});
</script>
