import { nextTick, onMounted, reactive, ref } from "vue";
import { ElLoading, ElMessage, FormInstance, FormRules } from "element-plus";
import { LoginResponse } from "../../entity/response";
import { useAppStore } from "../../stores/useAppStore";

export const useAction = () => {
  const appStore = useAppStore();

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
        const loadingInstance = ElLoading.service({ fullscreen: true });
        fetch(new URL("http://passtest.wiltechs.com/token"), {
          method: "POST",
          headers: {
            Authorization: "Basic NDUwYzZjMDNmYzQ0YzQzYjo3OWQ5MDJkYmZlM2Q3ODFm",
            "Content-type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
          body: `grant_type=${userinfo.grant_type}&username=${userinfo.username}&password=${userinfo.password}`,
        })
          .then(async (response) => {
            if (response.ok) {
              const data: LoginResponse = await response.json();
              if (data?.access_token) {
                appStore.userName = data.userName;
                appStore.access_token = data.access_token;
                appStore.expires = data[".expires"];
                gotoHome();
              }
            } else {
              const data = await response.json();
              errorDescription.value = data?.error_description ?? "";
            }
          })
          .catch((error) => {
            ElMessage({
              customClass: "login-error-message-box",
              offset: 36,
              message: error.toString(),
              type: "error",
            });
          })
          .finally(() => {
            loadingInstance.close();
          });
      }
    });
  };

  const gotoHome = async () => {
    await window.electronAPI.getCurrentWindow().close();
    window.electronAPI.createWindow("/home", {
      width: 960,
      height: 640,
      useContentSize: true,
      resizable: false,
      maximizable: false,
      titleBarStyle: "hidden",
      trafficLightPosition: {
        x: 12,
        y: 16,
      },
    });
  };

  const gotoSettings = () => {
    window.electronAPI.createWindow(`/settings`, {
      width: 720,
      height: 640,
      useContentSize: true,
      resizable: false,
      maximizable: false,
      minimizable: false,
      titleBarStyle: "hidden",
      alwaysOnTop: true,
      trafficLightPosition: {
        x: 12,
        y: 16,
      },
    });
  };

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
        }
      } else {
        loaded.value = true;
      }
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
