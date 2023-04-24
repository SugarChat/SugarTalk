<template>
  <Header title="加入会议" />
  <div class="container">
    <el-form label-position="top">
      <el-form-item label="会议号">
        <el-input v-model="state.roomId" placeholder="请输入会议号" clearable />
      </el-form-item>
      <el-form-item label="您的名称">
        <el-input
          v-model="state.nickname"
          placeholder="请输入您的名称"
          clearable
        />
      </el-form-item>
      <el-form-item label="会议设置">
        <div class="form-item">
          <el-checkbox label="自动连接音频" />
          <el-checkbox label="入会开启摄像头" />
          <el-checkbox label="入会开启麦克风" />
        </div>
      </el-form-item>
    </el-form>
    <div class="join-btn">
      <el-button
        type="primary"
        size="large"
        :disabled="disabled"
        @click="onJoinRoom"
      >
        加入会议
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import Header from "../../components/header/index.vue";
import { reactive, computed } from "vue";

const state = reactive({
  roomId: "room1",
  nickname: "",
});

const disabled = computed(() => !state.roomId);

const onJoinRoom = () => {
  window.electronAPI.getCurrentWindow().close();
  window.electronAPI.createWindow(
    `/room?roomId=${state.roomId}&nickname=${state.nickname}`,
    {
      width: 960,
      height: 640,
      minWidth: 960,
      minHeight: 640,
      useContentSize: true,
      titleBarStyle: "hidden",
    }
  );
};
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
