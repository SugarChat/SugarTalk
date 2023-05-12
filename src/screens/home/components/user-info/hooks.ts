import { useAppStore } from "../../../../stores/useAppStore";

export const useAction = () => {
  const appStore = useAppStore();

  return {
    appStore,
  };
};
