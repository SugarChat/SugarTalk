<template>
  <div class="user-item-container">
    <Avatar :size="72" :font-size="36" :name="userSession.userName" />
    <div class="user-info">
      <span class="title">{{ userSession.userName }}</span>
      <div :class="['mic-mute-status', userSession.isMuted && 'disabled']">
        <i class="iconfont icon-mic" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toRefs } from "vue";
import { UserSession } from "../../../../../../entity/response";
import Avatar from "../../../../../../components/avatar/index.vue";

interface Props {
  userSession: UserSession;
}

const props = defineProps<Props>();

const { userSession } = toRefs(props);
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
