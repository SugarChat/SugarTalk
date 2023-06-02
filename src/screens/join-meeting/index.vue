<template>
  <Header title="加入会议" :hide-maximizable="true" />
  <div class="container">
    <el-form
      ref="formRef"
      label-position="top"
      :model="state"
      size="large"
      :rules="rules"
    >
      <el-form-item label="会议号" prop="meetingNumber">
        <el-input
          v-model="state.meetingNumber"
          placeholder="请输入会议号"
          clearable
          :maxlength="5"
          :minlength="5"
        />
      </el-form-item>
      <el-form-item label="您的名称" prop="userName">
        <el-input
          v-model="state.userName"
          disabled
          placeholder="请输入您的名称"
          clearable
        />
      </el-form-item>
      <el-form-item label="会议设置">
        <div class="form-item">
          <el-checkbox label="自动连接音频" v-model="state.audio" disabled />
          <el-checkbox label="入会开启摄像头" v-model="state.camera" disabled />
          <el-checkbox label="入会开启麦克风" v-model="state.microphone" />
        </div>
      </el-form-item>
    </el-form>
    <div class="join-btn">
      <el-button
        type="primary"
        size="large"
        :disabled="disabled"
        @click="onJoinMeeting"
      >
        加入会议
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import Header from "../../components/header/index.vue";
import { useAction } from "./hooks";

const { formRef, rules, state, disabled, onJoinMeeting } = useAction();
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
