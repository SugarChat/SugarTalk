<template>
  <el-popover
    placement="bottom"
    :width="120"
    trigger="hover"
    :show-arrow="true"
  >
    <template #reference>
      <div :class="['network', isOnline && 'online']">
        <i class="iconfont icon-network" />
        <i v-if="!isOnline" class="iconfont icon-close" />
      </div>
    </template>
    <div class="network-container">
      <p class="online-status">
        {{ isOnline ? "网络连接正常" : "网络已断开，正在重连" }}
      </p>
    </div>
  </el-popover>
</template>

<script setup lang="ts">
import { useNetwork } from "@vueuse/core";

const { isOnline } = useNetwork();
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
