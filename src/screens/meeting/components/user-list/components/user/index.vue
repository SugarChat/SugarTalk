<template>
  <div :class="['user-list-item', soundLevelList[streamId] > 40 && 'active']">
    <Avatar :size="40" :name="userSession.userName" />
    <div class="user-box-footer">
      <p class="nickname">{{ userSession.userName }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, toRefs } from "vue";
import Avatar from "../../../../../../components/avatar/index.vue";
import { UserSession } from "../../../../../../entity/response";

interface Props {
  userSession: UserSession;
  soundLevelList: Record<string, number>;
}

const props = defineProps<Props>();

const { userSession } = toRefs(props);

const streamId = computed(
  () =>
    userSession.value.userSessionStreams?.find((stream) => stream?.streamId)
      ?.streamId ?? ""
);
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
