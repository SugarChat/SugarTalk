<template>
  <div class="traffic-light-container">
    <template v-if="!props.hideMinimizable">
      <el-tooltip
        effect="light"
        content="最小化"
        placement="bottom"
        :offset="2"
        :show-arrow="false"
      >
        <div class="btn" @click="onMinimize">
          <i class="iconfont icon-minimize" />
        </div>
      </el-tooltip>
    </template>

    <template v-if="!props.hideMaximizable">
      <el-tooltip
        effect="light"
        :content="isMaximizable ? '还原' : '最大化'"
        placement="bottom"
        :offset="2"
        :show-arrow="false"
      >
        <div class="btn" @click="onMaximize">
          <i class="iconfont icon-maximize" />
        </div>
      </el-tooltip>
    </template>

    <el-tooltip
      effect="light"
      content="关闭"
      placement="bottom"
      :offset="2"
      :show-arrow="false"
    >
      <div class="btn btn-close" @click="onClose">
        <i class="iconfont icon-close" />
      </div>
    </el-tooltip>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useNavigation } from "../../hooks/useNavigation";

interface Props {
  hideMinimizable?: boolean;
  hideMaximizable?: boolean;
  isDestroy?: boolean;
  close?: () => void;
}

const props = defineProps<Props>();

const navigation = useNavigation();

const isMaximizable = ref(false);

const onMinimize = () => {
  window.electronAPI.getCurrentWindow().minimize();
};

const onMaximize = () => {
  if (isMaximizable.value) {
    isMaximizable.value = false;
    window.electronAPI.getCurrentWindow().unmaximize();
  } else {
    isMaximizable.value = true;
    window.electronAPI.getCurrentWindow().maximize();
  }
};

const onClose = () => {
  if (props?.close) {
    props.close();
  } else {
    if (props.isDestroy) {
      navigation.destroy();
    } else {
      navigation.close();
    }
  }
};
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
