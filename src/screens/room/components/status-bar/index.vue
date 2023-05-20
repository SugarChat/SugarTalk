<template>
  <div class="status-bar">
    <div class="left">
      <MeetingInfo :meeting-query="meetingQuery" />
      <Network />
    </div>
    <div class="center"></div>
    <div class="right">
      <MeetingDuration />
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

interface Props {
  meetingQuery: MeetingQuery;
}

const { meetingQuery } = defineProps<Props>();
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
