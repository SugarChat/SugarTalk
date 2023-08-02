<template>
  <img
    ref="imageRef"
    class="message-image"
    :src="imageUrl"
    @dblclick="showViewer = true"
  />

  <ElImageViewer
    v-if="showViewer"
    :url-list="[imageUrl]"
    @close="showViewer = false"
  />
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, toRefs } from "vue";
import { Message } from "../../../../../../entity/types";
import { ElImageViewer } from "element-plus";

interface Props {
  message: Message;
}

const props = defineProps<Props>();

const { message } = toRefs(props);

const imageRef = ref<HTMLImageElement>();

const showViewer = ref(false);

const imageUrl = computed(
  () => `data:${message.value.fileType};base64,${message.value.content}`
);

const contextmenu = () => {
  window.electronAPI.showContextMenu(message.value.content);
};

onMounted(() => {
  nextTick(() => {
    imageRef.value?.addEventListener("contextmenu", contextmenu);
  });
});

onUnmounted(() => {
  imageRef.value?.removeEventListener("contextmenu", contextmenu);
});
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
