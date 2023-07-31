<template>
  <div
    :class="[
      'chat-message',
      appStore.userInfo.id === message.sendByUserId && 'rtl',
    ]"
  >
    <div class="chat-date">{{ message.sendTime }}</div>
    <div class="username">
      <p class="name">{{ message.sendByUserName }}</p>
    </div>
    <div class="content-wrap">
      <div class="content">
        <p class="text">{{ message.content }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Message } from "../../../../../../entity/types";
import { useAppStore } from "../../../../../../stores/useAppStore";

interface Props {
  message: Message;
}

const appStore = useAppStore();

const { message } = defineProps<Props>();
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
