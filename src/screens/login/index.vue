<template>
  <Header title="Sugar Talk" />
  <div class="login-container">
    <div class="app-info">
      <img class="app-logo" src="../../assets/sugarTalkLogo.png" />
      <p class="app-name">Sugar Talk</p>
    </div>
    <div class="login-btn">
      <el-button type="primary" size="large" @click="onLogin"
        >Foundation 登录</el-button
      >
    </div>
    <div class="other-login">其他登录方式</div>
    <div class="other-mode-list">
      <div class="other-mode-item">
        <div class="other-logo">
          <img class="other-logo-img" src="../../assets/wechat.png" />
        </div>
        <p class="title">Wechat</p>
      </div>
      <div class="other-mode-item">
        <div class="other-logo">
          <img class="other-logo-img" src="../../assets/google.png" />
        </div>
        <p class="title">Google</p>
      </div>
      <div class="other-mode-item">
        <div class="other-logo">
          <img class="other-logo-img" src="../../assets/facebook.png" />
        </div>
        <p class="title">Facebook</p>
      </div>
    </div>
    <el-tooltip effect="light" content="设置(待开发)" placement="bottom">
      <div class="setting">
        <i class="iconfont icon-setting" />
      </div>
    </el-tooltip>
  </div>
</template>

<script setup lang="ts">
import Header from "@components/header/index.vue";

const onLogin = () => {
  window.electronAPI.getCurrentWindow().close();
  window.electronAPI.createWindow("/home", {
    width: 960,
    height: 640,
    useContentSize: true,
    resizable: false,
    maximizable: false,
    titleBarStyle: "hidden",
    trafficLightPosition: {
      x: 12,
      y: 16,
    },
  });
};
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
