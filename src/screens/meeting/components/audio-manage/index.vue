<template>
  <ActionBtn
    v-loading="loading"
    :title="isMuted ? '取消静音' : '静音'"
    icon="icon-mic"
    :disabled="isMuted"
    @click="onClick"
  >
    <Microphone :size="24" :frequency="props.frequency" />
  </ActionBtn>
</template>

<script setup lang="ts">
import { getMediaDeviceAccessAndStatus } from "../../../../utils/media";
import ActionBtn from "../action-btn/index.vue";
import Microphone from "../../../../components/microphone/index.vue";
import { onMounted, ref, toRefs } from "vue";

interface Props {
  isMuted: boolean;
  frequency: number;
  update: (status: boolean) => Promise<void>;
}

const props = defineProps<Props>();

const { isMuted } = toRefs(props);

const loading = ref(false);

onMounted(async () => {
  getMediaDeviceAccessAndStatus("microphone");
});

const onClick = async () => {
  try {
    loading.value = true;
    if (isMuted.value) {
      const pass = await getMediaDeviceAccessAndStatus("microphone", true);
      if (!pass) return;
    }

    await props?.update(!isMuted.value);
  } finally {
    loading.value = false;
  }
};
</script>
