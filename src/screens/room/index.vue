<template>
  <Header borderBottom title="Sugar Talk会议" />

  <div class="container">
    <StatusBar />

    <UserPanel />
    <Watermark text="Sugar Talk" />

    <template v-if="videoStream">
      <div class="st-container">
        <Player :stream="videoStream" />
        <UserList />
      </div>
    </template>

    <video width="0" height="0" id="stream-media" autoplay playsInline muted />

    <video
      width="0"
      height="0"
      v-for="stream in streamsList"
      :key="stream.streamId"
      autoplay
      playsinline
      :srcObject="stream.stream"
    />

    <Footer>
      <template #left>
        <AudioManage :isMuted="isMuted" @update="updateMicMuteStatus" />
        <!-- <VideoManage /> -->
      </template>
      <template #content>
        <ScreenShare
          :is-share-screen="isShareScreen"
          @startShare="onStartShare"
          @stopShare="onStopShare"
        />
      </template>
      <template #right>
        <LeaveRoom />
      </template>
    </Footer>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import Header from "../../components/header/index.vue";
import StatusBar from "./components/status-bar/index.vue";
import UserPanel from "./components/user-panel/index.vue";
import UserList from "./components/user-list/index.vue";
import Footer from "./components/footer/index.vue";
import Player from "./components/player/index.vue";
import LeaveRoom from "./components/leave-room/index.vue";
import Watermark from "../../components/watermark/index.vue";
// import VideoManage from "./components/video-manage/index.vue";
import AudioManage from "./components/audio-manage/index.vue";
import ScreenShare from "./components/screen-share/index.vue";
import { useAction } from "./hooks";

const { query } = useRoute();

const {
  isMuted,
  isShareScreen,
  streamsList,
  videoStream,
  updateMicMuteStatus,
  onStartShare,
  onStopShare,
} = useAction();
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
