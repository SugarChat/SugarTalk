<template>
  <div
    ref="target"
    class="user-list-container"
    :style="`width: ${isExpand ? width : 0}px;`"
  >
    <el-scrollbar>
      <div class="user-box-list">
        <User
          v-for="userSession in meetingInfo.userSessions"
          :key="userSession.id"
          :user-session="userSession"
          :sound-level-list="soundLevelList"
        />
      </div>
    </el-scrollbar>
    <div class="expand-btn" @click="onExpand">
      <i :class="['iconfont icon-arrow-right', isExpand && 'active']" />
    </div>
    <div ref="handle" class="drag-resize" />
  </div>
</template>

<script setup lang="ts">
import { useDraggResize, useAction } from "./hooks";
import { Meeting } from "../../../../entity/response";
import User from "./components/user/index.vue";

interface Props {
  meetingInfo: Meeting;
  soundLevelList: Record<string, number>;
}

const { width, target, handle } = useDraggResize();

const { isExpand, onExpand } = useAction();

const { meetingInfo, soundLevelList } = defineProps<Props>();
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
