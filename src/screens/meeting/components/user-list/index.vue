<template>
  <div
    ref="target"
    class="user-list-container"
    :style="`width: ${isExpand ? width : 0}px;`"
  >
    <el-scrollbar>
      <div class="user-box-list">
        <div
          v-for="user in meetingInfo.userSessions"
          :key="user.id"
          :class="['user-box', 'active']"
        >
          <Avatar :size="40" :name="user.userName" />
          <div class="user-box-footer">
            <p class="nickname">{{ user.userName }}</p>
          </div>
        </div>
      </div>
    </el-scrollbar>
    <div class="expand-btn" @click="onExpand">
      <i :class="['iconfont icon-arrow-right', isExpand && 'active']" />
    </div>
    <div ref="handle" class="drag-resize" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useDraggResize } from "./hooks";
import Avatar from "../../../../components/avatar/index.vue";
import { Meeting } from "../../../../entity/response";
import { toRefs } from "vue";

interface Props {
  meetingInfo: Meeting;
}

const { width, target, handle } = useDraggResize();

const props = defineProps<Props>();

const { meetingInfo } = toRefs(props);

const isExpand = ref(false);

const onExpand = () => {
  isExpand.value = !isExpand.value;
};
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
