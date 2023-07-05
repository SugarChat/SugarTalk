import { onMounted } from "vue";
import { useAppStore } from "../../stores/useAppStore";
import { useNavigation } from "../../hooks/useNavigation";
import { createMeetingApi } from "../../services";
import { ElLoading, ElMessage } from "element-plus";
import { useSettingsStore } from "../../stores/useSettingsStore";
import { MeetingStreamMode } from "../../entity/enum";

export const useAction = () => {
  const appStore = useAppStore();

  const settingsStore = useSettingsStore();

  const navigation = useNavigation();

  onMounted(() => {
    navigation.closeToHide();
  });

  const onJoinMeeting = () => navigation.navigate("/join-meeting");

  const onQuickMeeting = async () => {
    const loading = ElLoading.service({ fullscreen: true });
    try {
      const { code, data, msg } = await createMeetingApi({
        meetingStreamMode: settingsStore.enableMCU
          ? MeetingStreamMode.MCU
          : MeetingStreamMode.SFU,
        startDate: new Date(),
        endDate: new Date(+new Date() + 1000 * 60 * 60 * 24),
      });
      if (code === 200) {
        navigation.navigate("/meeting", {
          audio: settingsStore.enableMicrophone,
          isMuted: !settingsStore.enableMicrophone,
          camera: false,
          meetingNumber: data?.meetingNumber,
          userName: appStore.userName,
          meetingStreamMode: MeetingStreamMode.SFU,
        });
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
    onJoinMeeting,
    onQuickMeeting,
    gotoSettings,
    onLogout,
  };
};
