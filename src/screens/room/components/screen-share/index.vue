<template>
  <ActionBtn title="共享屏幕" icon="icon-screen" @click="onOpen" />

  <el-dialog
    class="screen-share-dialog"
    v-model="visible"
    :width="718"
    :append-to-body="true"
    :center="true"
    :show-close="false"
    :align-center="true"
  >
    <Header title="选择共享内容" borderBottom />
    <div class="screen-share-body">
      <div class="screen-list">
        <div
          class="screen-item"
          v-for="source in screenSources"
          :key="source.id"
        >
          <Screen
            :source="source"
            :active="currentSource?.id === source.id"
            @click="onSelect"
          />
        </div>
      </div>
      <Tabs
        :appIcons="appIcons"
        :currentAppIcon="currentAppIcon"
        @click="onChangeAppIcon"
      />
      <div class="screen-list">
        <div class="screen-item" v-for="source in appSources" :key="source.id">
          <Screen
            :source="source"
            :active="currentSource?.id === source.id"
            @click="onSelect"
          />
        </div>
      </div>
    </div>
    <Footer @cancel="onClose" @confirm="onConfirm" />
  </el-dialog>
</template>

<script setup lang="ts">
import ActionBtn from "../action-btn/index.vue";
import Header from "@components/header/index.vue";
import Screen from "./components/screen/index.vue";
import Tabs from "./components/tabs/index.vue";
import Footer from "./components/footer/index.vue";
import { useAction } from "./hooks";
import { ScreenSource } from "../../../../entity/types";

interface Props {
  click?: (source: ScreenSource) => void;
}

const props = defineProps<Props>();

const {
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
} = useAction();

const onConfirm = () => {
  onClose();
  if (currentSource.value) {
    props?.click?.(currentSource.value);
  }
};
</script>

<style lang="scss">
@import "./index.scss";
</style>
