import { computed, onMounted } from "vue";
import { useAppStore } from "../../../../stores/useAppStore";

export const useFullscreen = () => {
  const appStore = useAppStore();

  const isFullscreen = computed(() => appStore.isFullscreen);

  const onExit = async () => {
    await window.electronAPI.getCurrentWindow().setFullScreen(false);
    appStore.isFullscreen = false;
  };

  const onEnter = async () => {
    await window.electronAPI.getCurrentWindow().setFullScreen(true);
    appStore.isFullscreen = true;
  };

  onMounted(() => {
    window.electronAPI.enterFullscreen(() => {
      appStore.isFullscreen = true;
    });
    window.electronAPI.leaveFullscreen(() => {
      appStore.isFullscreen = false;
    });
  });

  return {
    isFullscreen,
    onExit,
    onEnter,
  };
};
