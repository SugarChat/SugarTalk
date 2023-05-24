<template>
  <div class="settings-about-us">
    <img src="../../../../assets/images/sugarTalkLogo.png" />
    <p v-if="appInfo?.name" class="app-name">{{ appInfo.name }}</p>
    <p v-if="appInfo?.version" class="app-version">V {{ appInfo.version }}</p>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from "../../../../stores/useAppStore";
import { computed } from "vue";

const appStore = useAppStore();

const appInfo = computed(() => appStore.appInfo);
</script>

<style scoped lang="scss">
.settings-about-us {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 110px;

  .app-name {
    font-size: var(--font-size-extra-large);
    font-weight: var(--font-weight-primary);
    margin-top: 12px;
  }

  .app-version {
    margin-top: 30px;
  }
}
</style>
