<template>
  <ActionBtn title="邀请" icon="icon-invite" @click="() => onToggle(true)" />

  <el-dialog
    class="custom-dialog"
    v-model="visible"
    :width="640"
    :append-to-body="true"
    :center="true"
    :show-close="false"
    :align-center="true"
  >
    <Header :title="`会议号：${meetingQuery.meetingNumber}`" borderBottom>
      <template #right>
        <div class="invite-header">
          <div class="close-btn" @click="() => onToggle(false)">
            <i class="iconfont icon-close" />
          </div>
        </div>
      </template>
    </Header>
    <div class="invite-body">
      <div class="title">
        {{ meetingQuery.userName }}邀请您加入{{ appStore.appInfo.name }}会议
      </div>
      <div class="invite-item">
        <p>会议主题：</p>
        <p>{{ moderator.userName }}的个人会议</p>
      </div>
      <div class="invite-item">
        <p>会议号：</p>
        <p>{{ meetingQuery.meetingNumber }}</p>
      </div>
    </div>
    <div class="invite-footer">
      <el-button class="btn" @click="onCopyAll">复制全部信息</el-button>
      <el-button class="btn" type="primary" @click="onCopyMeeting"
        >复制会议号</el-button
      >
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { useToggle } from "@vueuse/core";
import ActionBtn from "../action-btn/index.vue";
import Header from "../../../../components/header/index.vue";
import { MeetingQuery } from "../../../../entity/types";
import { ElMessage } from "element-plus";
import { useAppStore } from "../../../../stores/useAppStore";
import { UserSession } from "../../../../entity/response";

interface Props {
  meetingQuery: MeetingQuery;
  moderator: UserSession;
}

const { meetingQuery, moderator } = defineProps<Props>();

const appStore = useAppStore();

const [visible, onToggle] = useToggle();

const onCopyAll = () => {
  window.clipboard.writeText(
    `${meetingQuery.userName} 邀请您加入${appStore.appInfo.name}会议\n\r会议主题：${moderator.userName}的个人会议\n\r会议号：${meetingQuery.meetingNumber}`
  );
  ElMessage({
    offset: 28,
    message: "会议邀请已复制到剪切板",
    type: "success",
  });
};

const onCopyMeeting = () => {
  window.clipboard.writeText(
    `#${appStore.appInfo.name}：${meetingQuery.meetingNumber}`
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
