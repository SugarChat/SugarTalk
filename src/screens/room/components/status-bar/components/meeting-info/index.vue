<template>
  <el-popover
    placement="bottom"
    :width="200"
    trigger="hover"
    :show-arrow="true"
  >
    <template #reference>
      <div class="meeting-info">
        <i class="iconfont icon-info" />
      </div>
    </template>
    <div class="meeting-info-container">
      <p class="title">***的个人会议室</p>
      <div class="info-item">
        <p class="info-label">会议号：</p>
        <p>{{ meetingQuery?.roomId }}</p>
        <i class="iconfont icon-copy" @click="onCopy" />
      </div>
      <div class="info-item">
        <p class="info-label">主持人：</p>
        <p>***</p>
      </div>
    </div>
  </el-popover>
</template>

<script setup lang="ts">
import { ElMessage } from "element-plus";
import { MeetingQuery } from "../../../../../../entity/types";
import { useAppStore } from "../../../../../../stores/useAppStore";

interface Props {
  meetingQuery: MeetingQuery;
}

const { meetingQuery } = defineProps<Props>();

const appStore = useAppStore();

const onCopy = () => {
  window.clipboard.writeText(
    `#${appStore.appInfo.name}：${meetingQuery.roomId}`
  );
  ElMessage({
    offset: 28,
    message: "会议号已复制到粘贴板",
    type: "success",
  });
};
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
