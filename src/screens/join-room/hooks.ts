import { reactive, computed, ref } from "vue";
import { useNavigation } from "../../hooks/useNavigation";
import { useAppStore } from "../../stores/useAppStore";
import { ElLoading, ElMessage, FormInstance, FormRules } from "element-plus";
import { meetingJoinApi } from "../../services";

export const useAction = () => {
  const appStore = useAppStore();

  const navigation = useNavigation();

  const formRef = ref<FormInstance>();

  const state = reactive({
    audio: true,
    microphone: true,
    camera: false,
    roomId: "",
    userName: appStore.userName,
  });

  const rules = reactive<FormRules>({
    roomId: [
      { required: true, message: "会议号必填", trigger: "blur" },
      { min: 5, max: 5, message: "请输入5位会议号", trigger: "blur" },
    ],
    userName: [{ required: true, message: "名称必填", trigger: "blur" }],
  });

  const disabled = computed(
    () => !state.roomId || (state.roomId && state.roomId.length !== 5)
  );

  const onJoinRoom = () => {
    formRef.value?.validate(async (valid) => {
      if (valid) {
        navigation.close().navigate("/room", state);

        // const loading = ElLoading.service({ fullscreen: true });
        // try {
        //   const { code, data, msg } = await meetingJoinApi({
        //     meetingNumber: state.roomId,
        //     isMuted: !state.microphone,
        //   });
        //   if (code === 200) {
        //     navigation
        //       .close()
        //       .navigate("/room", { ...state, meetingInfo: data });
        //   } else {
        //     ElMessage({
        //       offset: 36,
        //       message: msg,
        //       type: "error",
        //     });
        //   }
        // } finally {
        //   loading.close();
        // }
      }
    });
  };

  return {
    formRef,
    rules,
    state,
    disabled,
    onJoinRoom,
  };
};
