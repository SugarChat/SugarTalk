<template>
  <Header
    class="header"
    borderBottom
    title="Sugar Talk"
    :is-destroy="true"
    :hideMaximizable="true"
  >
    <template #right>
      <div class="header-right">
        <el-tooltip effect="light" content="设置" placement="bottom">
          <div class="settings" @click="gotoSettings">
            <i class="iconfont icon-settings" />
          </div>
        </el-tooltip>
        <UserInfo @logout="onLogout" />
      </div>
    </template>
  </Header>
  <div class="container">
    <div class="meeting-btns">
      <JoinBtn title="加入会议" icon="icon-add" @click="onJoinMeeting" />
      <JoinBtn title="快速会议" icon="icon-quick" @click="onQuickMeeting" />
    </div>
  </div>
</template>

<script setup lang="ts">
import Header from "../../components/header/index.vue";
import UserInfo from "./components/user-info/index.vue";
import JoinBtn from "./components/join-btn/index.vue";
import { useAction } from "./hooks";

const { onJoinMeeting, onQuickMeeting, gotoSettings, onLogout } = useAction();
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
