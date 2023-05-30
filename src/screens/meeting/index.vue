<template>
  <Header borderBottom title="Sugar Talk会议" />

  <div class="container">
    <StatusBar :meeting-query="meetingQuery" />

    <UserPanel
      :meeting-query="meetingQuery"
      :streams-list="streamsList"
      :meeting-info="meetingInfo"
      :remote-sound-level-list="remoteSoundLevelList"
    />
    <Watermark :text="`Sugar Talk ${meetingQuery.userName}`" />

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
        <AudioManage
          :isMuted="meetingQuery.isMuted"
          :update="updateMicMuteStatus"
        />
        <!-- <VideoManage /> -->
      </template>
      <template #content>
        <ScreenShare
          :is-share-screen="isShareScreen"
          :before-open="beforeStartShare"
          @startShare="onStartShare"
          @stopShare="onStopShare"
        />
        <Invite :meeting-query="meetingQuery" />
      </template>
      <template #right>
        <LeaveMeeting ref="leaveMeetingRef" @on-confirm="leaveMeeting" />
      </template>
    </Footer>
  </div>
</template>

<script setup lang="ts">
import Header from "../../components/header/index.vue";
import StatusBar from "./components/status-bar/index.vue";
import UserPanel from "./components/user-panel/index.vue";
import UserList from "./components/user-list/index.vue";
import Footer from "./components/footer/index.vue";
import Player from "./components/player/index.vue";
import LeaveMeeting from "./components/leave-meeting/index.vue";
import Watermark from "../../components/watermark/index.vue";
// import VideoManage from "./components/video-manage/index.vue";
import AudioManage from "./components/audio-manage/index.vue";
import ScreenShare from "./components/screen-share/index.vue";
import Invite from "./components/invite/index.vue";
import { useAction } from "./hooks";

const {
  leaveMeetingRef,
  isShareScreen,
  meetingQuery,
  meetingInfo,
  streamsList,
  videoStream,
  remoteSoundLevelList,
  updateMicMuteStatus,
  beforeStartShare,
  onStartShare,
  onStopShare,
  leaveMeeting,
} = useAction();
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
