import { PiniaPluginContext } from "pinia";

const storageMap = new Map<string, string>();

const piniaPluginCommunication = ({ store, options }: PiniaPluginContext) => {
  window.addEventListener("storage", (event) => {
    const key = event.key;
    if (options.persist && key && store.$id === key) {
      const fromStorage = localStorage.getItem(key);
      if (fromStorage && storageMap.get(key) !== fromStorage) {
        storageMap.set(key, fromStorage);
        store.$patch(JSON.parse(fromStorage));
      }
    }
  });
};

export default piniaPluginCommunication;
