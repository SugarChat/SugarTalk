<template>
  <div class="screen-share-footer">
    <el-button class="footer-btn" @click="onCancel">取消</el-button>
    <el-button class="footer-btn" type="primary" @click="onConfirm"
      >确认共享</el-button
    >
  </div>
</template>

<script setup lang="ts">
interface Emits {
  (event: "cancel"): void;
  (event: "confirm"): void;
}

const emits = defineEmits<Emits>();

const onCancel = () => emits("cancel");

const onConfirm = () => emits("confirm");
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
