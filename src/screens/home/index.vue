<template>
  <Header class="header" borderBottom title="Sugar Talk">
    <template #right>
      <UserInfo @logout="onLogout" />
    </template>
  </Header>
  <div class="container">
    <div class="left">
      <div class="room-btns">
        <JoinBtn title="加入会议" icon="icon-add" @click="onJoinRoom" />
        <JoinBtn title="快速会议" icon="icon-quick" @click="onQuickRoom" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Header from "../../components/header/index.vue";
import UserInfo from "./components/user-info/index.vue";
import JoinBtn from "./components/join-btn/index.vue";
import { useAction } from "./hooks";

const { onJoinRoom, onQuickRoom, onLogout } = useAction();
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
