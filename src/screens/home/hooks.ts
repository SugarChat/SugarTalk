import { onMounted } from "vue";
import { useAppStore } from "../../stores/useAppStore";
import { useNavigation } from "../../hooks/useNavigation";
import { meetingCreateApi, meetingJoinApi } from "../../services";
import { ElLoading, ElMessage } from "element-plus";
import { useSettingsStore } from "../../stores/useSettingsStore";

export const useAction = () => {
  const appStore = useAppStore();

  const settingsStore = useSettingsStore();

  const navigation = useNavigation();

  onMounted(() => {
    navigation.closeToHide();
  });

  const onJoinRoom = () => navigation.navigate("/join-room");

  const onQuickRoom = async () => {
    const loading = ElLoading.service({ fullscreen: true });
    try {
      const { code, data, msg } = await meetingCreateApi({
        meetingStreamMode: 0,
      });
      if (code === 200) {
        const result = await meetingJoinApi({
          meetingNumber: data?.roomId,
          isMuted: !settingsStore.enableMicrophone,
        });
        if (result?.code === 200) {
          navigation.navigate("/room", {
            audio: settingsStore.enableMicrophone,
            microphone: true,
            camera: false,
            roomId: data?.roomId,
            userName: appStore.userName,
          });
        } else {
          ElMessage({
            offset: 50,
            message: result.msg,
            type: "error",
          });
        }
      } else {
        ElMessage({
          offset: 50,
          message: msg,
          type: "error",
        });
      }
    } finally {
      loading.close();
    }
  };

  const gotoSettings = () => navigation.navigate("/settings");

  const onLogout = () => {
    appStore.logout();
    navigation.destroy().openMainWindow();
  };

  return {
    onJoinRoom,
    onQuickRoom,
    gotoSettings,
    onLogout,
  };
};
