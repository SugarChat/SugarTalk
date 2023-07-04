<template>
  <div class="screen-share-footer">
    <el-icon><Refresh @click="onRefresh" /></el-icon>
    <div class="footer-action">
      <el-button class="footer-btn" @click="onCancel">取消</el-button>
      <el-button class="footer-btn" type="primary" @click="onConfirm"
        >确认共享</el-button
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { Refresh } from "@element-plus/icons-vue";

interface Emits {
  (event: "cancel"): void;
  (event: "confirm"): void;
  (event: "refresh"): void;
}

const emits = defineEmits<Emits>();

const onCancel = () => emits("cancel");

const onConfirm = () => emits("confirm");

const onRefresh = () => emits("refresh");
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
