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
      <div v-if="message.type === 0" class="content">
        <p class="text">{{ message.content }}</p>
      </div>
      <Image v-if="message.type === 1" :message="message" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from "../../../../../../stores/useAppStore";
import { Message } from "../../../../../../entity/types";
import Image from "../image/index.vue";

interface Props {
  message: Message;
}

const appStore = useAppStore();

const { message } = defineProps<Props>();
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
