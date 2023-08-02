<template>
  <ActionBtn title="聊天" :count="unreadCount" icon="icon-chat" @click="open" />

  <el-dialog
    class="custom-dialog"
    v-model="state.visible"
    :width="405"
    :append-to-body="true"
    :center="true"
    :show-close="true"
    :align-center="true"
  >
    <div ref="dropZoneRef" class="chat-dialog">
      <Header
        title="聊天"
        :is-inner="true"
        borderBottom
        :close="() => (state.visible = false)"
      />
      <div class="chat-body">
        <el-scrollbar
          ref="scrollbar"
          view-class="scrollbar-view"
          @scroll="scroll"
        >
          <Message
            v-for="message in messages"
            :key="message.id"
            :message="message"
          />
        </el-scrollbar>
      </div>
      <div class="chat-footer">
        <div class="chat-tool-box">
          <el-tooltip effect="light" content="选择图片" placement="top">
            <div class="chat-tool-item" @click="() => select()">
              <i class="iconfont icon-pictures" />
            </div>
          </el-tooltip>
        </div>
        <div class="textarea-box">
          <textarea
            ref="textarea"
            class="textarea"
            v-model="content"
            @keydown="keydown($event)"
            maxlength="1024"
            placeholder="说点什么..."
          />
        </div>
      </div>
      <div v-show="isOverDropZone" class="chat-mask">
        <p class="mask-text">松开发送</p>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import ActionBtn from "../action-btn/index.vue";
import Header from "../../../../components/header/index.vue";
import Message from "./components/message/index.vue";
import { useAction } from "./hooks";
import { Emits } from "./props";

const emits = defineEmits<Emits>();

const {
  textarea,
  dropZoneRef,
  scrollbar,
  state,
  messages,
  content,
  unreadCount,
  isOverDropZone,
  open,
  keydown,
  scroll,
  onMessage,
  select,
} = useAction(emits);

defineExpose({
  message: onMessage,
});
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
