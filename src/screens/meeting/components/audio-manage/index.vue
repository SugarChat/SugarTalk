<template>
  <ActionBtn
    v-loading="loading"
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
import { onMounted, ref, toRefs } from "vue";

interface Props {
  isMuted: boolean;
  update: (status: boolean) => Promise<void>;
}

const props = defineProps<Props>();

const { isMuted } = toRefs(props);

const loading = ref(false);

onMounted(async () => {
  getMediaDeviceAccessAndStatus("microphone");
});

const onClick = useDebounceFn(async () => {
  if (isMuted.value) {
    const pass = await getMediaDeviceAccessAndStatus("microphone", true);
    if (!pass) return;
  }
  try {
    loading.value = true;
    await props?.update(!isMuted.value);
  } finally {
    loading.value = false;
  }
}, 300);
</script>
