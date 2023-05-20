import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import pinia from "./stores";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import "normalize.css";
import "./styles/index.scss";
import { useSettingsStore } from "./stores/useSettingsStore";
import { useAppStore } from "./stores/useAppStore";

createApp(App)
  .use(pinia)
  .use(router)
  .use(ElementPlus)
  .mount("#app")
  .$nextTick(async () => {
    useAppStore().init();
    useSettingsStore().init();
  });
