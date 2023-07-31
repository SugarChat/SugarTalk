import { computed, nextTick, reactive, ref } from "vue";
import { v4 as uuidv4 } from "uuid";
import { Emits } from "./props";
import { Message } from "../../../../entity/types";
import { MessageSendStatus, MessageType } from "../../../../entity/enum";
import { useAppStore } from "../../../../stores/useAppStore";
import dayjs from "dayjs";

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

export const useAction = (emits: Emits) => {
  const appStore = useAppStore();

  const textarea = ref<HTMLTextAreaElement>();

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
      } else {
        const text = content.value.trim();
        if (text) {
          const message = {
            id: uuidv4(),
            type: MessageType.Message,
            content: content.value,
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
    messages.value.push(message);
    if (state.visible && !state.lockScroll) {
      scrollToBottom();
    }
  };

  const scroll = ({ scrollTop }: { scrollTop: number }) => {
    const scrollHeight = scrollbar.value!.wrapRef.scrollHeight;
    console.log({ scrollHeight, scrollTop });
    if (scrollHeight - 640 > scrollTop) {
      state.lockScroll = true;
    } else {
      state.lockScroll = false;
    }
  };

  return {
    textarea,
    scrollbar,
    state,
    messages,
    content,
    unreadCount,
    open,
    keydown,
    scroll,
    onMessage,
  };
};
