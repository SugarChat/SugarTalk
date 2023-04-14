<template>
  <Header class="header" borderBottom title="Sugar Talk">
    <template #right>
      <UserInfo @logout="onLogout" />
    </template>
  </Header>
  <div class="container">
    <div class="left">
      <JoinBtn title="加入会议" icon="icon-add" @click="onJoinRoom" />
    </div>
  </div>
</template>

<script setup lang="ts">
import Header from "@components/header/index.vue";
import UserInfo from "./components/user-info/index.vue";
import JoinBtn from "./components/join-btn/index.vue";
import { useAction } from "./hooks";

const { onJoinRoom, onLogout } = useAction();
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
