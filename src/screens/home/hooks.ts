import { onMounted } from "vue";
import { useAppStore } from "../../stores/useAppStore";

export const useAction = () => {
  const appStore = useAppStore();

  onMounted(() => {
    window.electronAPI.closeToHide();
  });

  const onJoinRoom = () => {
    window.electronAPI.createWindow("/join-room", {
      width: 375,
      height: 667,
      titleBarStyle: "hidden",
      resizable: false,
      maximizable: false,
      useContentSize: true,
    });
  };

  const onQuickRoom = () => {
    window.electronAPI.createWindow(`/room?roomId=${"room1"}&nickname=${""}`, {
      width: 960,
      height: 640,
      minWidth: 960,
      minHeight: 640,
      titleBarStyle: "hidden",
    });
  };

  const onLogout = () => {
    appStore.logout();
    window.electronAPI.getCurrentWindow().destroy();
    window.electronAPI.openMainWindow();
  };

  return {
    onJoinRoom,
    onQuickRoom,
    onLogout,
  };
};
