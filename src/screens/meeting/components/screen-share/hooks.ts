import { useToggle } from "@vueuse/core";
import { onMounted, ref } from "vue";
import { ScreenSource } from "../../../../entity/types";
import {
  getMediaDeviceAccessAndStatus,
  getScreenCaptureAccess,
} from "../../../../utils/media";
import { useAppStore } from "../../../../stores/useAppStore";

export const useAction = () => {
  const appStore = useAppStore();

  const [visible, onToggle] = useToggle();

  const currentSource = ref<ScreenSource>();

  const allSources = ref<ScreenSource[]>([]);

  const screenSources = ref<ScreenSource[]>([]);

  const appSources = ref<ScreenSource[]>([]);

  const appIcons = ref<string[]>([]);

  const currentAppIcon = ref("");

  onMounted(() => {
    getScreenCaptureAccess();
  });

  const onOpen = async () => {
    const pass = await getMediaDeviceAccessAndStatus("screen", true);
    if (!pass) return;
    let sources = await window.desktopCapturer.getSources({
      types: ["window", "screen"],
      fetchWindowIcons: true,
    });
    sources = sources.filter((source) => source.name !== appStore.appInfo.name);
    currentSource.value = sources?.[0];
    allSources.value = sources;
    screenSources.value = sources.filter((source) => !source.appIcon);
    appSources.value = sources.filter((source) => !!source.appIcon);
    appIcons.value = appSources.value.reduce<string[]>((res, source) => {
      if (!res.includes(source.appIcon)) {
        res.push(source.appIcon);
      }
      return res;
    }, []);
    currentAppIcon.value = "";
    onToggle(true);
  };

  const onClose = () => onToggle(false);

  const onSelect = (source: ScreenSource) => (currentSource.value = source);

  const onChangeAppIcon = (appIcon: string) => {
    currentAppIcon.value = appIcon;
    if (appIcon) {
      appSources.value = allSources.value.filter(
        (source) => source.appIcon === appIcon
      );
    } else {
      appSources.value = allSources.value.filter((source) => !!source.appIcon);
    }
    if (
      !appSources.value.some(
        (source) => source.id === currentSource.value?.id
      ) &&
      !screenSources.value.some(
        (source) => source.id === currentSource.value?.id
      )
    ) {
      currentSource.value = appSources.value?.[0];
    }
  };

  return {
    visible,
    currentSource,
    screenSources,
    appSources,
    appIcons,
    currentAppIcon,
    onOpen,
    onClose,
    onSelect,
    onChangeAppIcon,
  };
};
