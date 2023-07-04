<template>
  <ActionBtn
    :title="`成员(${meetingInfo?.userSessions?.length ?? 0})`"
    icon="icon-avatar"
    @click="visible = true"
  />

  <el-dialog
    class="custom-dialog"
    v-model="visible"
    :width="430"
    :append-to-body="true"
    :center="true"
    :show-close="true"
    :align-center="true"
  >
    <Header
      :title="`成员(${meetingInfo?.userSessions?.length ?? 0})`"
      borderBottom
    />
    <div class="member-body">
      <div class="search-box">
        <el-input placeholder="搜索成员" clearable v-model="searchName">
          <template #prepend>
            <el-button :icon="Search" />
          </template>
        </el-input>
      </div>
      <el-scrollbar>
        <template v-if="userSessions.length > 0">
          <div class="user-list">
            <User
              v-for="userSession in userSessions"
              :key="userSession.id"
              :user-session="userSession"
              :sound-level-list="props.soundLevelList"
            />
          </div>
        </template>
        <template v-else>
          <div class="not-found">
            <img
              class="not-found-image"
              src="../../../../assets/images/not-found.png"
            />
            <p class="not-found-tips">未找到相关成员</p>
          </div>
        </template>
      </el-scrollbar>
    </div>
    <div class="member-footer">
      <template v-if="userSessions.length > 0">
        <el-button plain size="small" :loading="loading" @click="onClick">{{
          isMuted ? "解除静音" : "静音"
        }}</el-button>
      </template>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import ActionBtn from "../action-btn/index.vue";
import Header from "../../../../components/header/index.vue";
import User from "./components/user/index.vue";
import { ref } from "vue";
import { Search } from "@element-plus/icons-vue";
import { Meeting } from "../../../../entity/response";
import { toRefs } from "vue";
import { getMediaDeviceAccessAndStatus } from "../../../../utils/media";
import { computed } from "vue";

interface Props {
  meetingInfo: Meeting;
  soundLevelList: Record<string, number>;
  isMuted: boolean;
  update: (status: boolean) => Promise<void>;
}

const props = defineProps<Props>();

const { meetingInfo, isMuted } = toRefs(props);

const visible = ref(false);

const loading = ref(false);

const searchName = ref("");

const userSessions = computed(
  () =>
    props?.meetingInfo?.userSessions?.filter((user) =>
      user?.userName
        ?.toLocaleLowerCase()
        ?.includes(searchName.value?.toLocaleLowerCase())
    ) ?? []
);

const onClick = async () => {
  try {
    loading.value = true;
    if (isMuted.value) {
      const pass = await getMediaDeviceAccessAndStatus("microphone", true);
      if (!pass) return;
    }

    await props?.update(!isMuted.value);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
