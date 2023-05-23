<template>
  <div class="user-panel">
    <el-scrollbar>
      <div class="user-list">
        <div class="user-item">
          <Avatar :size="72" :font-size="36" :name="meetingQuery.userName" />
          <div class="user-info">
            <span class="title">{{ meetingQuery.userName }}</span>
            <div
              :class="['mic-mute-status', meetingQuery.isMuted && 'disabled']"
            >
              <i class="iconfont icon-mic" />
            </div>
          </div>
        </div>

        <div
          class="user-item"
          v-for="(item, index) in streamsList"
          :key="item.streamId"
        >
          <Avatar :size="72" :font-size="36" :name="item.streamId" />
          <div class="user-info">
            <span class="title">{{ item.streamId }}</span>
            <div
              :class="[
                'mic-mute-status',
                remoteSoundLevelList[item.streamId] < 0.00009 && 'disabled',
              ]"
            >
              <i class="iconfont icon-mic" />
            </div>
          </div>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { toRefs } from "vue";
import { MeetingQuery, StreamItem } from "../../../../entity/types";
import Avatar from "../../../../components/avatar/index.vue";

interface Props {
  meetingQuery: MeetingQuery;
  streamsList: StreamItem[];
  remoteSoundLevelList: Record<string, number>;
}

const props = defineProps<Props>();

const { meetingQuery, streamsList, remoteSoundLevelList } = toRefs(props);
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
