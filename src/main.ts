import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import pinia from "./stores";
// import "./samples/node-api";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import "normalize.css";
import "./styles/index.scss";

createApp(App)
  .use(router)
  .use(pinia)
  .use(ElementPlus)
  .mount("#app")
  .$nextTick(() => {
    postMessage({ payload: "removeLoading" }, "*");
  });
