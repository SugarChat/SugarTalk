<template>
  <div class="settings-check-box">
    <slot name="left"></slot>
    <el-checkbox size="large" :checked="checked" @change="change">
      <slot>入会开启摄像头</slot>
    </el-checkbox>
    <slot name="right"></slot>
  </div>
</template>

<script setup lang="ts">
import { toRefs } from "vue";

interface Props {
  checked: boolean;
}

interface Emits {
  (event: "change", checked: boolean): void;
}

const props = defineProps<Props>();

const emits = defineEmits<Emits>();

const { checked } = toRefs(props);

const change = (checked: boolean) => emits("change", checked);
</script>

<style scoped lang="scss">
.settings-check-box {
  display: flex;
  align-items: center;
  margin-bottom: 20px;

  ::v-deep(.el-checkbox) {
    height: auto;

    .el-checkbox__inner {
      width: 16px;
      height: 16px;

      &::after {
        width: 4px;
        border-width: 2px;
      }
    }

    .el-checkbox__label {
      color: var(--color-text-primary);
      font-weight: initial;
    }
  }
}
</style>
