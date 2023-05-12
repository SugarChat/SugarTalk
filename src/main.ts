import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import pinia from "./stores";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import "normalize.css";
import "./styles/index.scss";

createApp(App).use(pinia).use(router).use(ElementPlus).mount("#app");
