<template>
  <div class="user-panel">
    <el-scrollbar>
      <div class="user-list">
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
import { StreamItem } from "../../../../entity/types";
import Avatar from "../../../../components/avatar/index.vue";

interface Props {
  streamsList: StreamItem[];
  remoteSoundLevelList: Record<string, number>;
}

const props = defineProps<Props>();

const { streamsList, remoteSoundLevelList } = toRefs(props);
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
