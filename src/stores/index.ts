import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import piniaPluginCommunication from "./plugins/pinia-plugin-communication";

const pinia = createPinia();

pinia.use(piniaPluginPersistedstate);

pinia.use(piniaPluginCommunication);

export default pinia;
