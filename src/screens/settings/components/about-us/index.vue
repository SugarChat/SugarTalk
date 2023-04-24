<template>
  <div class="settings-about-us">
    <img src="../../../../assets/sugarTalkLogo.png" />
    <p v-if="appInfo?.name" class="app-name">{{ appInfo.name }}</p>
    <p v-if="appInfo?.version" class="app-version">V {{ appInfo.version }}</p>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { AppInfo } from "../../../../renderer";

const appInfo = ref<AppInfo>();

onMounted(async () => {
  appInfo.value = await window.electronAPI.appInfo();
});
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
