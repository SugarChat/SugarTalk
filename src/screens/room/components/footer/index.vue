<template>
  <div class="footer">
    <div class="footer-left">
      <slot name="left"></slot>
    </div>

    <div class="footer-content">
      <slot name="content"></slot>
      <ActionBtn title="设置" icon="icon-setting" @click="onSettings" />
    </div>

    <div class="footer-right">
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useNavigation } from "../../../../hooks/useNavigation";
import ActionBtn from "../action-btn/index.vue";

const navigation = useNavigation();

const onSettings = () => navigation.navigate("/settings");
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
