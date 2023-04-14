import { onMounted } from "vue";

export const useAction = () => {
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

  const onLogout = () => {
    window.electronAPI.getCurrentWindow().destroy();
    window.electronAPI.openMainWindow();
  };

  return {
    onJoinRoom,
    onLogout,
  };
};
