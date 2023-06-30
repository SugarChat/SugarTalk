<template>
  <div class="microphone-container" :style="`--svs-size: ${size ?? 24}px;`">
    <svg
      t="1688103211611"
      class="icon"
      viewBox="0 0 1024 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      p-id="1589"
      width="100%"
      height="100%"
    >
      <defs>
        <linearGradient :id="gradientId" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop
            :offset="`${percentage}%`"
            :style="`stop-color: ${color ?? '#333'}`"
          />
          <stop
            offset="0%"
            :style="`stop-color: ${activeColor ?? '#34c759'}`"
          />
        </linearGradient>
      </defs>
      <path
        d="M701 197v362.25c0 51.975-21.2625 99.225-55.51875 133.48125S563.975 748.25 512 748.25c-103.95 0-189-85.05-189-189V197C323 93.05 408.05 8 512 8s189 85.05 189 189z"
        :fill="`url(#${gradientId})`"
        p-id="1590"
      ></path>
      <path
        d="M811.25 496.25v141.75c0 2.75625-0.39375 5.5125-1.0828125 8.26875-18.2109375 67.134375-57.9796875 124.1296875-110.5453125 164.2921875-42.8203125 32.68125-94.10625 54.3375-149.23125 61.228125-3.9375 0.4921875-6.890625 3.8390625-6.890625 7.7765625V937.25c0 8.6625 7.0875 15.75 15.75 15.75h78.75c34.7484375 0 63 28.2515625 63 63H323c0-34.7484375 28.2515625-63 63-63h78.75c8.6625 0 15.75-7.0875 15.75-15.75v-57.5859375c0-3.9375-2.953125-7.284375-6.890625-7.7765625-122.85-15.4546875-226.7015625-103.8515625-259.7765625-225.61875-0.6890625-2.6578125-1.0828125-5.5125-1.0828125-8.26875V496.9390625c0-17.128125 13.4859375-31.696875 30.6140625-32.1890625 17.8171875-0.4921875 32.3859375 13.78125 32.3859375 31.5v127.771875c0 6.7921875 1.0828125 13.584375 3.2484375 19.9828125C312.4671875 743.2296875 406.278125 811.25 512 811.25s199.5328125-68.0203125 233.0015625-167.2453125c2.165625-6.3984375 3.2484375-13.190625 3.2484375-19.9828125V496.9390625c0-17.128125 13.4859375-31.696875 30.6140625-32.1890625 17.8171875-0.4921875 32.3859375 13.78125 32.3859375 31.5z"
        :fill="color"
        p-id="1591"
      ></path>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, toRefs } from "vue";

interface Props {
  size: number;
  color?: string;
  activeColor?: string;
  frequency: number;
}

const props = defineProps<Props>();

const { size, color, activeColor, frequency } = toRefs(props);

const gradientId = ref(Math.random().toString(32).substring(2));

const frame = ref<number>(0);

const percentage = ref(0);

const getFrequency = () => {
  const value = 100 - (frequency.value / 150) * 100;
  percentage.value = value > 100 ? 0 : value;
  frame.value = requestAnimationFrame(getFrequency);
};

onMounted(getFrequency);

onUnmounted(() => cancelAnimationFrame(frame.value));
</script>

<style scoped lang="scss">
.microphone-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--svs-size);
  height: var(--svs-size);
}
</style>
