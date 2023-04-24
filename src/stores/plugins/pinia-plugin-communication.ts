import { PiniaPluginContext } from "pinia";
import { GUID } from "../../utils/utils";

let _hash = "";

let _subscriber = false;

const piniaPluginCommunication = ({ store, options }: PiniaPluginContext) => {
  store.$subscribe(() => {
    if (options.persist && !_subscriber) {
      _hash = GUID();
      window.store.dispatch(store.$id, _hash);
    } else {
      _subscriber = false;
    }
  });

  window.store.subscribe((id: string, hash: string) => {
    if (id === store.$id && _hash !== hash) {
      _subscriber = true;
      try {
        const fromStorage = localStorage?.getItem(id);
        if (fromStorage) {
          const storeData = JSON.parse(fromStorage);
          store.$patch(storeData);
        }
      } catch {}
    }
  });
};

export default piniaPluginCommunication;
