<template>
  <el-button v-if="isModerator" type="danger" plain @click="onOpen"
    >结束会议</el-button
  >
  <el-button v-else type="danger" plain @click="onOpen">离开会议</el-button>

  <el-dialog
    class="before-leave-meeting-dialog"
    v-model="state.beforeVisible"
    :append-to-body="true"
    :show-close="false"
    :center="true"
    :align-center="true"
    :width="192"
  >
    <el-button type="danger" @click="onEndMeeting">结束会议</el-button>
    <el-button type="danger" plain @click="onLeaveMeeting">离开会议</el-button>
    <el-button @click="onClose">取消</el-button>
  </el-dialog>

  <el-dialog
    class="leave-meeting-dialog"
    v-model="state.leaveVisible"
    :append-to-body="true"
    :show-close="false"
    :center="true"
    :align-center="true"
    :width="428"
  >
    <template #header>
      <div class="header">离开会议</div>
    </template>
    <div class="content">离开会议后，您仍可使用此会议号再次加入会议。</div>
    <template #footer>
      <el-button class="leave-btn" @click="onClose">取消</el-button>
      <el-button class="leave-btn" type="primary" @click="onLeaveMeeting">
        离开会议
      </el-button>
    </template>
  </el-dialog>

  <el-dialog
    class="end-meeting-dialog"
    v-model="state.endVisible"
    :append-to-body="true"
    :show-close="false"
    :center="true"
    :align-center="true"
    :width="428"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <div class="content">会议已结束</div>
    <template #footer>
      <el-button class="end-btn" type="primary" @click="onEnd">{{
        `知道了(${state.countdown})`
      }}</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive, toRefs } from "vue";

interface Props {
  isModerator: boolean;
}

interface Emits {
  (event: "onLeaveMeeting"): void;
  (event: "onEndMeeting"): void;
}

interface Exposes {
  open: () => void;
  close: () => void;
  openEnd: () => void;
}

const props = defineProps<Props>();

const { isModerator } = toRefs(props);

const emits = defineEmits<Emits>();

const state = reactive({
  beforeVisible: false,
  leaveVisible: false,
  endVisible: false,
  countdown: 0,
});

const onOpen = () => {
  if (state.endVisible) return;
  if (isModerator.value) {
    state.beforeVisible = true;
  } else {
    state.leaveVisible = true;
  }
};

const onClose = () => {
  if (isModerator.value) {
    state.beforeVisible = false;
  } else {
    state.leaveVisible = false;
  }
};

const onLeaveMeeting = () => {
  onClose();
  emits("onLeaveMeeting");
};

const onEndMeeting = () => {
  onClose();
  emits("onEndMeeting");
};

const onEnd = () => {
  state.endVisible = false;
  emits("onLeaveMeeting");
};

const endLoop = () => {
  setTimeout(() => {
    const countdown = state.countdown - 1;
    if (countdown === 0) {
      onEnd();
    } else {
      state.countdown = countdown;
      endLoop();
    }
  }, 1000);
};

const onOpenEnd = () => {
  state.endVisible = true;
  state.countdown = 5;
  endLoop();
};

defineExpose<Exposes>({
  open: onOpen,
  close: onClose,
  openEnd: onOpenEnd,
});
</script>

<style lang="scss">
@import "./index.scss";
</style>
