<template>
  <Header
    class="header"
    :title="appStore.appInfo.name"
    :is-destroy="true"
    :hideMaximizable="true"
  />
  <div class="container">
    <div class="user-info">
      <UserInfo @logout="onLogout" />
      <el-tooltip effect="light" content="设置" placement="bottom">
        <div class="settings" @click="gotoSettings">
          <i class="iconfont icon-settings" />
        </div>
      </el-tooltip>
    </div>
    <div class="meeting-btns">
      <template v-if="appStore.isMeeting">
        <JoinBtn
          :highlight="true"
          title="返回会议"
          icon="icon-goback"
          @click="onBackMeeting"
        />
      </template>
      <template v-else>
        <JoinBtn title="加入会议" icon="icon-add" @click="onJoinMeeting" />
      </template>

      <JoinBtn
        :disabled="appStore.isMeeting"
        title="快速会议"
        icon="icon-quick"
        @click="onQuickMeeting"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import Header from "../../components/header/index.vue";
import UserInfo from "./components/user-info/index.vue";
import JoinBtn from "./components/join-btn/index.vue";
import { useAction } from "./hooks";

const {
  appStore,
  onJoinMeeting,
  onQuickMeeting,
  onBackMeeting,
  gotoSettings,
  onLogout,
} = useAction();
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
