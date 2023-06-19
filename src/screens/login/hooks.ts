import { nextTick, onMounted, reactive, ref } from "vue";
import { ElLoading, ElMessage, FormInstance, FormRules } from "element-plus";
import { useAppStore } from "../../stores/useAppStore";
import { LoginApi } from "../../services";
import { useNavigation } from "../../hooks/useNavigation";

export const useAction = () => {
  const appStore = useAppStore();

  const navigation = useNavigation();

  const formRef = ref<FormInstance>();

  const loaded = ref(false);

  const userinfo = reactive({
    grant_type: "password",
    username: "",
    password: "",
  });

  const errorDescription = ref("");

  const rules = reactive<FormRules>({
    username: [
      { required: true, message: "UserName is Required", trigger: "blur" },
    ],
    password: [
      { required: true, message: "Password is Required", trigger: "blur" },
    ],
  });

  const onLogin = () => {
    errorDescription.value = "";
    formRef.value?.validate((valid) => {
      if (valid) {
        const loading = ElLoading.service({ fullscreen: true });
        LoginApi(userinfo)
          .then((response) => {
            if (response?.access_token) {
              appStore.login(response);
              gotoHome();
            }
          })
          .catch((error) => {
            errorDescription.value = error?.toString();
          })
          .finally(() => {
            loading.close();
          });
      }
    });
  };

  const gotoHome = () => navigation.close().navigate("/home");

  const gotoSettings = () => navigation.navigate("/settings");

  const onDevelopingTip = () => {
    ElMessage({
      customClass: "login-message-box",
      offset: 36,
      message: "开发中",
      type: "warning",
    });
  };

  onMounted(() => {
    nextTick(() => {
      if (appStore.expires) {
        if (+new Date(appStore.expires) > +new Date()) {
          setTimeout(() => {
            gotoHome();
          }, 500);
          return;
        }
      }
      loaded.value = true;
    });
  });

  return {
    loaded,
    formRef,
    userinfo,
    rules,
    errorDescription,
    onLogin,
    gotoSettings,
    onDevelopingTip,
  };
};
