import { useToggle, useDebounceFn } from "@vueuse/core";
import { onMounted, ref } from "vue";
import { ScreenSource } from "../../../../entity/types";
import {
  getMediaDeviceAccessAndStatus,
  getScreenCaptureAccess,
} from "../../../../utils/media";

export const useAction = () => {
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

  const onOpen = useDebounceFn(async () => {
    const pass = await getMediaDeviceAccessAndStatus("screen", true);
    if (!pass) return;
    const sources = await window.desktopCapturer.getSources({
      types: ["window", "screen"],
      fetchWindowIcons: true,
    });
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
  }, 300);

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
