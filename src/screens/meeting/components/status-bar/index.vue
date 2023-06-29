<template>
  <div class="status-bar">
    <div class="left">
      <MeetingInfo :meeting-query="meetingQuery" :moderator="moderator" />
      <Network />
    </div>
    <div class="center"></div>
    <div class="right">
      <template v-if="settingsStore.showMeetingDuration">
        <MeetingDuration />
      </template>
      <Fullscreen />
    </div>
  </div>
</template>

<script setup lang="ts">
import Network from "./components/network/index.vue";
import MeetingInfo from "./components/meeting-info/index.vue";
import MeetingDuration from "./components/meeting-duration/index.vue";
import Fullscreen from "./components/fullscreen/index.vue";
import { MeetingQuery } from "../../../../entity/types";
import { useSettingsStore } from "../../../../stores/useSettingsStore";
import { UserSession } from "../../../../entity/response";

interface Props {
  meetingQuery: MeetingQuery;
  moderator: UserSession;
}

const { meetingQuery, moderator } = defineProps<Props>();

const settingsStore = useSettingsStore();
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
