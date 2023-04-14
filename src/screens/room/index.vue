<template>
  <Header borderBottom title="Sugar Talk会议" />

  <div class="container">
    <StatusBar />

    <template v-if="stream">
      <div class="st-container">
        <Player :stream="stream!" />
        <UserList />
      </div>
    </template>
    <template v-else>
      <UserPanel />
    </template>

    <Footer :startShare="onStartShare" :stop-share="onStipShare">
      <template #right>
        <LeaveRoom />
      </template>
    </Footer>
  </div>
</template>

<script setup lang="ts">
import Header from "@components/header/index.vue";
import StatusBar from "./components/status-bar/index.vue";
import UserPanel from "./components/user-panel/index.vue";
import UserList from "./components/user-list/index.vue";
import Footer from "./components/footer/index.vue";
import Player from "./components/player/index.vue";
import LeaveRoom from "./components/leave-room/index.vue";

import { useAction } from "./hooks";

const { stream, onStartShare, onStipShare } = useAction();
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
