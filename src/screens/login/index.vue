<template>
  <Header :title="appStore.appInfo.name" :hide-maximizable="true" />
  <div class="login-container">
    <div class="app-info">
      <img class="app-logo" src="../../assets/images/sugarTalkLogo.png" />
      <p class="app-name">{{ appStore.appInfo.name }}</p>
    </div>
    <template v-if="loaded">
      <el-form
        ref="formRef"
        label-position="top"
        size="large"
        :model="userinfo"
        :rules="rules"
      >
        <el-form-item label="Username" prop="username">
          <el-input v-model="userinfo.username" />
        </el-form-item>
        <el-form-item label="Password" prop="password">
          <el-input
            v-model="userinfo.password"
            type="password"
            @keyup.enter="onLogin"
          />
        </el-form-item>
        <el-form-item>
          <div class="login-btn">
            <el-button type="primary" @click="onLogin">LOGIN</el-button>
          </div>
          <div v-show="errorDescription" class="el-form-item__error">
            {{ errorDescription }}
          </div>
        </el-form-item>
      </el-form>
      <div class="other-login">其他登录方式</div>
      <div class="other-mode-list">
        <div class="other-mode-item" @click="onDevelopingTip">
          <div class="other-logo">
            <img class="other-logo-img" src="../../assets/images/wechat.png" />
          </div>
          <p class="title">Wechat</p>
        </div>
        <div class="other-mode-item" @click="onDevelopingTip">
          <div class="other-logo">
            <img class="other-logo-img" src="../../assets/images/google.png" />
          </div>
          <p class="title">Google</p>
        </div>
        <div class="other-mode-item" @click="onDevelopingTip">
          <div class="other-logo">
            <img
              class="other-logo-img"
              src="../../assets/images/facebook.png"
            />
          </div>
          <p class="title">Facebook</p>
        </div>
      </div>
      <el-tooltip effect="light" content="设置" placement="bottom">
        <div class="setting" @click="gotoSettings">
          <i class="iconfont icon-settings" />
        </div>
      </el-tooltip>
    </template>
  </div>
</template>

<script setup lang="ts">
import Header from "../../components/header/index.vue";
import { useAction } from "./hooks";

const {
  loaded,
  formRef,
  userinfo,
  rules,
  errorDescription,
  appStore,
  onLogin,
  gotoSettings,
  onDevelopingTip,
} = useAction();
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>

<style lang="scss">
.login-message-box {
  width: 100% !important;
  max-width: 100% !important;
}
</style>
