import { Ref, computed, onMounted, onUnmounted, ref } from "vue";
import { UserSession } from "../entity/response";

export const userGetFrequency = (
  userSession: Ref<UserSession>,
  soundLevelList: Ref<Record<string, number>>
) => {
  const isSpeaking = ref(false);

  const frequency = ref(0);

  const frame = ref<number>(0);

  const isMuted = computed(
    () => userSession.value.isMuted && frequency.value <= 20
  );

  const getByteFrequencyData = () => {
    frequency.value =
      soundLevelList.value?.[userSession.value?.streamId ?? ""] ?? 0;
    isSpeaking.value = frequency.value > 40;
    frame.value = requestAnimationFrame(getByteFrequencyData);
  };

  onMounted(getByteFrequencyData);

  onUnmounted(() => cancelAnimationFrame(frame.value));

  return {
    isSpeaking,
    frequency,
    isMuted,
  };
};
