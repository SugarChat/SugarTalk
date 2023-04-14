<template>
  <Header borderBottom title="Sugar Talk会议" />
  <div class="container">
    <StatusBar />
    <UserTabs />
    <Player :stream="stream!" />
    <Footer :screenShare="onScreenShare">
      <template #right>
        <LeaveRoom />
      </template>
    </Footer>
  </div>
</template>

<script setup lang="ts">
import Header from "@components/header/index.vue";
import StatusBar from "./components/status-bar/index.vue";
import UserTabs from "./components/user-tabs/index.vue";
import Footer from "./components/footer/index.vue";
import Player from "./components/player/index.vue";
import LeaveRoom from "./components/leave-room/index.vue";
import { useAction } from "./hooks";

const { stream, onScreenShare } = useAction();
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
