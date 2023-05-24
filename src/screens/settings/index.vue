<template>
  <Header title="设置" borderBottom />

  <div class="settings-container">
    <div class="left">
      <div
        :class="['category', carouselItemName === 'settings' && 'active']"
        @click="setActiveItem('settings')"
      >
        <i class="iconfont icon-setting" />
        <p class="label">常规设置</p>
      </div>
      <div
        :class="['category', carouselItemName === 'audio' && 'active']"
        @click="setActiveItem('audio')"
      >
        <i class="iconfont icon-audio-on" />
        <p class="label">音频</p>
      </div>
      <div
        :class="['category', carouselItemName === 'about-us' && 'active']"
        @click="setActiveItem('about-us')"
      >
        <img class="image" src="../../assets/images/sugarTalkLogo.png" />
        <p class="label">关于我们</p>
      </div>
    </div>
    <div class="right">
      <template v-if="carouselItemName === 'settings'">
        <Settings />
      </template>
      <template v-if="carouselItemName === 'audio'">
        <AudioManage />
      </template>
      <template v-if="carouselItemName === 'about-us'">
        <AboutUs />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Header from "../../components/header/index.vue";
import Settings from "./components/settings/index.vue";
import AboutUs from "./components/about-us/index.vue";
import AudioManage from "./components/audio-manage/index.vue";

const carousel = ref();

const carouselItemName = ref("settings");

const setActiveItem = (name: string) => {
  carousel.value?.setActiveItem(name);
  carouselItemName.value = name;
};
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
