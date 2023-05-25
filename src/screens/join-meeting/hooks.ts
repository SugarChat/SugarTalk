import { reactive, computed, ref } from "vue";
import { useNavigation } from "../../hooks/useNavigation";
import { useAppStore } from "../../stores/useAppStore";
import { ElLoading, ElMessage, FormInstance, FormRules } from "element-plus";
import { getMeetingInfoApi } from "../../services";

export const useAction = () => {
  const appStore = useAppStore();

  const navigation = useNavigation();

  const formRef = ref<FormInstance>();

  const state = reactive({
    audio: true,
    microphone: false,
    camera: false,
    meetingNumber: "",
    userName: appStore.userName,
  });

  const rules = reactive<FormRules>({
    meetingNumber: [
      { required: true, message: "会议号必填", trigger: "blur" },
      { min: 5, max: 5, message: "请输入5位会议号", trigger: "blur" },
    ],
    userName: [{ required: true, message: "名称必填", trigger: "blur" }],
  });

  const disabled = computed(
    () =>
      !state.meetingNumber ||
      (state.meetingNumber && state.meetingNumber.length !== 5)
  );

  const onJoinMeeting = () => {
    formRef.value?.validate(async (valid) => {
      if (valid) {
        const loading = ElLoading.service({ fullscreen: true });
        try {
          const { code, data, msg } = await getMeetingInfoApi({
            meetingNumber: state.meetingNumber,
          });
          if (code === 200) {
            console.log("data", data);
            navigation.close().navigate("/meeting", {
              ...state,
              isMuted: !state.microphone,
              meetingStreamMode: data.meetingStreamMode,
            });
          } else {
            ElMessage({
              offset: 36,
              message: msg,
              type: "error",
            });
          }
        } finally {
          loading.close();
        }
      }
    });
  };

  return {
    formRef,
    rules,
    state,
    disabled,
    onJoinMeeting,
  };
};
