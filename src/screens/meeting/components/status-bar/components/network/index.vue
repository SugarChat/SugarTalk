<template>
  <el-popover
    placement="bottom"
    :width="120"
    trigger="hover"
    :show-arrow="true"
  >
    <template #reference>
      <div v-if="initFinished" :class="['network', isOnline && 'online']">
        <i class="iconfont icon-network" />
        <i v-if="!isOnline" class="iconfont icon-close" />
      </div>
      <div v-else />
    </template>
    <div class="network-container">
      <p class="online-status">
        {{ isOnline ? "网络连接正常" : "网络已断开，正在重连" }}
      </p>
      <div class="network-item">
        <p class="network-label">延迟：</p>
        <p>{{ delay }}</p>
      </div>
    </div>
  </el-popover>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { useNetwork, useTimeout } from "@vueuse/core";
import { PingResponse } from "../../../../../../renderer";

const networkState = useNetwork();

const pingResponse = ref<PingResponse>();

const initFinished = ref(false);

const delay = computed(() =>
  pingResponse.value?.alive && pingResponse.value?.time
    ? `${Math.ceil(pingResponse.value.time)} ms`
    : "未知"
);

const isOnline = computed(
  () => networkState.isOnline.value && pingResponse.value?.alive
);

const { start } = useTimeout(2000, {
  controls: true,
  callback: () => {
    window.electronAPI.ping("18.162.51.80").then((res) => {
      pingResponse.value = res;
      !initFinished.value && (initFinished.value = true);
      start();
    });
  },
});

onMounted(() => {
  start();
});
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
