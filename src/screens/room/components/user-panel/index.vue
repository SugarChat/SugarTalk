<template>
  <div class="user-panel">
    <el-scrollbar>
      <div class="user-list">
        <div
          class="user-item"
          v-for="(item, index) in streamsList"
          :key="item.streamId"
        >
          <div class="user-avatar">
            <!-- <img
              class="user-avatar-img"
              src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
            /> -->
            <span>{{ item.streamId[0] }}</span>
          </div>
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
