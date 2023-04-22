<template>
  <el-popover
    placement="bottom"
    :width="200"
    trigger="hover"
    :show-arrow="true"
  >
    <template #reference>
      <div class="meeting-info">
        <i class="iconfont icon-info" />
      </div>
    </template>
    <div class="meeting-info-container">
      <p class="title">使命召唤的个人会议室</p>
      <div class="info-item">
        <p class="info-label">会议号：</p>
        <p>335 1774 4914</p>
        <i class="iconfont icon-copy" @click="onCopy" />
      </div>
      <div class="info-item">
        <p class="info-label">主持人：</p>
        <p>使命召唤</p>
      </div>
    </div>
  </el-popover>
</template>

<script setup lang="ts">
const onCopy = () => {
  window.clipboard.writeText("335 1774 4914");
};
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
