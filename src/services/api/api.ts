import axios from "axios";
import { useAppStore } from "../../stores/useAppStore";
import { ElMessage } from "element-plus";
import config from "../../config";

export const Api = axios.create({
  baseURL: config.baseURL,
  timeout: 50000,
  headers: {
    "Content-Type": "application/json",
  },
});

Api.interceptors.request.use((config) => {
  if (!config.headers.Authorization) {
    const appStore = useAppStore();
    config.headers.Authorization = `Bearer ${appStore.access_token}`;
  }
  return config;
});

Api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const errorStr = error?.response?.data?.error ?? error?.toString() ?? "";
    errorStr &&
      ElMessage({
        offset: 50,
        message: errorStr,
        type: "error",
      });
  }
);
