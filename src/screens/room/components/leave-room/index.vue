<template>
  <el-button type="danger" plain @click="onOpen">离开会议</el-button>

  <el-dialog
    class="leave-room-dialog"
    v-model="visible"
    :append-to-body="true"
    :show-close="false"
    :center="true"
    :align-center="true"
    :width="428"
  >
    <template #header>
      <div class="header">离开会议</div>
    </template>
    <div class="content">离开会议后，您仍可使用此会议号再次加入会议。</div>
    <template #footer>
      <el-button class="leave-btn" @click="onClose">取消</el-button>
      <el-button class="leave-btn" type="primary" @click="onConfirm">
        离开会议
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { useToggle } from "@vueuse/core";

interface Emits {
  (event: "onConfirm"): void;
}

const emits = defineEmits<Emits>();

const [visible, onToggle] = useToggle();

const onOpen = () => onToggle(true);

const onClose = () => onToggle(false);

const onConfirm = () => {
  onClose();
  emits("onConfirm");
};
</script>

<style lang="scss">
@import "./index.scss";
</style>
