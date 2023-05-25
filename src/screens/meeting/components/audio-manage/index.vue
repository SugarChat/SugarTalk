<template>
  <ActionBtn
    :title="isMuted ? '取消静音' : '静音'"
    icon="icon-mic"
    :disabled="isMuted"
    @click="onClick"
  />
</template>

<script setup lang="ts">
import { useDebounceFn } from "@vueuse/core";
import { getMediaDeviceAccessAndStatus } from "../../../../utils/media";
import ActionBtn from "../action-btn/index.vue";
import { onMounted, toRefs } from "vue";

interface Props {
  isMuted: boolean;
}

interface Emits {
  (event: "update", status: boolean): void;
}

const props = defineProps<Props>();

const emits = defineEmits<Emits>();

const { isMuted } = toRefs(props);

onMounted(async () => {
  getMediaDeviceAccessAndStatus("microphone");
});

const onClick = useDebounceFn(async () => {
  if (isMuted.value) {
    const pass = await getMediaDeviceAccessAndStatus("microphone", true);
    if (!pass) return;
  }
  emits("update", !isMuted.value);
}, 300);
</script>
