import { Ref, computed, nextTick, onMounted, reactive, ref } from "vue";
import { v4 as uuidv4 } from "uuid";
import { Emits } from "./props";
import { Message } from "../../../../entity/types";
import { MessageSendStatus, MessageType } from "../../../../entity/enum";
import { useAppStore } from "../../../../stores/useAppStore";
import dayjs from "dayjs";
import { useDropZone, useEventListener, useFileDialog } from "@vueuse/core";

const insertTextAtCursor = (element: HTMLTextAreaElement, text: string) => {
  const start = element.selectionStart;
  const end = element.selectionEnd;
  element.value =
    element.value.slice(0, start) + text + element.value.slice(end);
  requestAnimationFrame(() =>
    element.setSelectionRange(start + text.length, start + text.length)
  );
};

const useScroll = () => {
  const scrollbar = ref<{
    handleScroll: () => void;
    scrollTo: (options: ScrollToOptions | number, yCoord?: number) => void;
    setScrollTop: (scrollTop: number) => void;
    setScrollLeft: (scrollLeft: number) => void;
    update: () => void;
    wrapRef: HTMLDivElement;
  }>();

  const setScrollTop = (scrollTop = 0) =>
    scrollbar.value!.setScrollTop(scrollTop);

  const scrollToBottom = () =>
    nextTick(() => setScrollTop(scrollbar.value!.wrapRef.scrollHeight));

  return {
    scrollbar,
    scrollToBottom,
  };
};

const useComposition = (el: Ref<HTMLTextAreaElement | undefined>) => {
  const isCompositionend = ref(false);

  useEventListener(
    el,
    "compositionstart",
    () => (isCompositionend.value = false)
  );

  useEventListener(el, "compositionend", () => (isCompositionend.value = true));

  return {
    isCompositionend,
  };
};

export const useAction = (emits: Emits) => {
  const appStore = useAppStore();

  const textarea = ref<HTMLTextAreaElement>();

  const dropZoneRef = ref<HTMLDivElement>();

  const { scrollbar, scrollToBottom } = useScroll();

  const state = reactive({
    visible: false,
    lockScroll: false,
  });

  const messages = ref<Message[]>([]);

  const content = ref("");

  const unreadCount = computed(
    () =>
      messages.value.filter(
        (message) =>
          message.sendByUserId !== appStore.userInfo.id && !message.isReaded
      ).length
  );

  const { isCompositionend } = useComposition(textarea);

  const sendPicture = (base64Data: string, file: File) => {
    const chunkSize = 1024 * 15;
    let offset = 0;

    const message: Message = {
      id: uuidv4(),
      type: MessageType.Picture,
      content: "",
      fileType: file.type,
      filePath: file.path,
      size: base64Data.length,
      sendStatus: MessageSendStatus.Sending,
      sendByUserId: appStore.userInfo.id,
      sendByUserName: appStore.userInfo.userName,
      sendToUserId: 0,
      sendToUserName: "",
      sendTime: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      isReaded: false,
    };

    while (offset < base64Data.length) {
      const chunk = base64Data.slice(offset, offset + chunkSize);
      offset += chunkSize;
      message.content = chunk;
      emits("send", message);
    }
    message.content = "";
    message.sendStatus = MessageSendStatus.Success;
    emits("send", message);
    message.content = base64Data;
    return message;
  };

  const { isOverDropZone } = useDropZone(
    dropZoneRef,
    (files: File[] | null) => {
      files?.forEach((file) => {
        if (file.type.includes("image")) {
          window.electronAPI
            .getBase64ByFilePath(file.path)
            .then((base64Data) => {
              const message = sendPicture(base64Data, file);
              messages.value.push(message);
              scrollToBottom();
            });
        }
      });
    }
  );

  const { open: select, onChange } = useFileDialog({
    accept: "image/*",
  });

  onChange((files) => {
    if (files && files.length > 0) {
      Array.from(files).forEach((file) => {
        if (file.type.includes("image")) {
          window.electronAPI
            .getBase64ByFilePath(file.path)
            .then((base64Data) => {
              const message = sendPicture(base64Data, file);
              messages.value.push(message);
              scrollToBottom();
            });
        }
      });
    }
  });

  const open = () => {
    state.visible = true;
    messages.value.forEach((message) => (message.isReaded = true));
    scrollToBottom();
  };

  const keydown = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (event.shiftKey) {
        insertTextAtCursor(textarea.value!, "\n");
      } else if (isCompositionend.value) {
        const text = content.value.trim();
        if (text) {
          const message: Message = {
            id: uuidv4(),
            type: MessageType.Message,
            content: content.value,
            fileType: "",
            filePath: "",
            size: content.value.length,
            sendStatus: MessageSendStatus.Success,
            sendByUserId: appStore.userInfo.id,
            sendByUserName: appStore.userInfo.userName,
            sendToUserId: 0,
            sendToUserName: "",
            sendTime: dayjs().format("YYYY-MM-DD HH:mm:ss"),
            isReaded: false,
          };
          messages.value.push(message);
          content.value = "";
          scrollToBottom();
          emits("send", message);
        }
      }
    }
  };

  const onMessage = (message: Message) => {
    message.isReaded = state.visible;
    switch (message.type) {
      case MessageType.Message: {
        messages.value.push(message);
        break;
      }
      case MessageType.Picture: {
        const currentMessage = messages.value.find(
          (item) => item.id === message.id
        );
        if (message.sendStatus === MessageSendStatus.Sending) {
          if (currentMessage) {
            currentMessage.content += message.content;
          } else {
            messages.value.push(message);
          }
        } else if (message.sendStatus === MessageSendStatus.Success) {
          if (currentMessage) {
            currentMessage.sendStatus = message.sendStatus;
          }
        }
        break;
      }
    }
    if (state.visible && !state.lockScroll) {
      scrollToBottom();
    }
  };

  const scroll = ({ scrollTop }: { scrollTop: number }) => {
    const scrollHeight = scrollbar.value!.wrapRef.scrollHeight;
    if (scrollHeight - 640 > scrollTop) {
      state.lockScroll = true;
    } else {
      state.lockScroll = false;
    }
  };

  useEventListener(document, "paste", async (event) => {
    const items = event.clipboardData?.items;
    if (items) {
      const item = Array.from(items)?.[0];
      const file = item?.getAsFile();
      if (file && file.type?.includes("image")) {
        if (file.path) {
          // 从本地复制的图片
          event.preventDefault();
          window.electronAPI
            .getBase64ByFilePath(file.path)
            .then((base64Data) => {
              const message = sendPicture(base64Data, file);
              messages.value.push(message);
              scrollToBottom();
            });
        } else {
          // 从应用复制的图片数据
          const base64Data = await window.clipboard.readImage();
          const base64WithoutPrefix = base64Data.replace(
            /^data:image\/\w+;base64,/,
            ""
          );
          const message = sendPicture(base64WithoutPrefix, file);
          messages.value.push(message);
          scrollToBottom();
        }
      }
    }
  });

  return {
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
  };
};
