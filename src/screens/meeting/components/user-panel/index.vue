<template>
  <div class="user-panel">
    <el-scrollbar>
      <div class="user-list">
        <User
          v-for="userSession in meetingInfo.userSessions"
          :key="userSession.id"
          :user-session="userSession"
        />
      </div>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { toRefs } from "vue";
import { MeetingQuery, StreamItem } from "../../../../entity/types";
import User from "./components/user/index.vue";
import { Meeting } from "../../../../entity/response";

interface Props {
  meetingQuery: MeetingQuery;
  streamsList: StreamItem[];
  meetingInfo: Meeting;
  remoteSoundLevelList: Record<string, number>;
}

const props = defineProps<Props>();

const { meetingQuery, streamsList, meetingInfo, remoteSoundLevelList } =
  toRefs(props);
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
