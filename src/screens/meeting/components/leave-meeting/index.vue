<template>
  <el-button v-if="isModerator" type="danger" plain @click="onOpen"
    >结束会议</el-button
  >
  <el-button v-else type="danger" plain @click="onOpen">离开会议</el-button>

  <el-dialog
    class="before-leave-meeting-dialog"
    v-model="beforeVisible"
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
    v-model="visible"
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
</template>

<script setup lang="ts">
import { toRefs } from "vue";
import { ref } from "vue";

interface Props {
  isModerator: boolean;
}

interface Emits {
  (event: "onLeaveMeeting"): void;
  (event: "onEndMeeting"): void;
}

const props = defineProps<Props>();

const { isModerator } = toRefs(props);

const emits = defineEmits<Emits>();

const beforeVisible = ref(false);

const visible = ref(false);

const onOpen = () => {
  if (isModerator.value) {
    beforeVisible.value = true;
  } else {
    visible.value = true;
  }
};

const onClose = () => {
  if (isModerator.value) {
    beforeVisible.value = false;
  } else {
    visible.value = false;
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

defineExpose({
  open: onOpen,
  close: onClose,
});
</script>

<style lang="scss">
@import "./index.scss";
</style>
