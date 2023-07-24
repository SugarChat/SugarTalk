<template>
  <div :class="['meeting-page', videoStream && 'share-mode']">
    <Header
      borderBottom
      :title="`${appStore.appInfo.name}会议`"
      :close="blockClose"
    />

    <div class="container">
      <StatusBar :meeting-query="meetingQuery" :moderator="moderator" />

      <UserPanel
        :meeting-info="meetingInfo"
        :sound-level-list="soundLevelList"
      />

      <Watermark
        v-if="settingsStore.enableWatermark"
        :text="`${appStore.appInfo.name} ${meetingQuery.userName}`"
      />

      <Speaking
        v-if="meetingInfo?.userSessions?.length > 0"
        :meeting-info="meetingInfo"
        :sound-level-list="soundLevelList"
      />

      <template v-if="videoStream">
        <div class="st-container">
          <Player
            :stream="videoStream"
            @update="drawingBoardRef?.resize"
          ></Player>
          <UserList
            :meeting-info="meetingInfo"
            :sound-level-list="soundLevelList"
          />
        </div>
      </template>

      <DrawingBoard ref="drawingBoardRef" @drawing="sendDrawing" />

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
            :frequency="currentFrequency"
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
          <Invite :meeting-query="meetingQuery" :moderator="moderator" />
          <Member
            :meeting-info="meetingInfo"
            :sound-level-list="soundLevelList"
            :isMuted="meetingQuery.isMuted"
            :update="updateMicMuteStatus"
          />
        </template>
        <template #right>
          <LeaveMeeting
            ref="leaveMeetingRef"
            :is-moderator="isModerator"
            @on-leave-meeting="leaveMeeting"
            @on-end-meeting="endMeeting"
          />
        </template>
      </Footer>
    </div>
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
import Member from "./components/member/index.vue";
import Invite from "./components/invite/index.vue";
import Speaking from "./components/speaking/index.vue";
import DrawingBoard from "./components/drawing-board/index.vue";
import { useAction } from "./hooks";

const {
  leaveMeetingRef,
  settingsStore,
  isShareScreen,
  meetingQuery,
  meetingInfo,
  streamsList,
  videoStream,
  soundLevelList,
  currentFrequency,
  moderator,
  isModerator,
  appStore,
  drawingBoardRef,
  updateMicMuteStatus,
  beforeStartShare,
  onStartShare,
  onStopShare,
  leaveMeeting,
  endMeeting,
  blockClose,
  sendDrawing,
} = useAction();
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
