<template>
  <div class="user-panel">
    <el-scrollbar>
      <div class="user-list">
        <div class="user-list-container">
          <User
            v-for="userSession in meetingInfo.userSessions"
            :key="userSession.id"
            :user-session="userSession"
            :sound-level-list="props.soundLevelList"
          />
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { toRefs } from "vue";
import User from "./components/user/index.vue";
import { Meeting } from "../../../../entity/response";

interface Props {
  meetingInfo: Meeting;
  soundLevelList: Record<string, number>;
}

const props = defineProps<Props>();

const { meetingInfo } = toRefs(props);
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
