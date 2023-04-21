<template>
  <ActionBtn title="邀请" icon="icon-invite" @click="() => onToggle(true)" />

  <el-dialog
    class="invite-dialog"
    v-model="visible"
    :width="640"
    :append-to-body="true"
    :center="true"
    :show-close="false"
    :align-center="true"
  >
    <Header title="会议号：335 1774 4914" borderBottom />
    <div class="invite-body"></div>
  </el-dialog>
</template>

<script setup lang="ts">
import { useToggle } from "@vueuse/core";
import ActionBtn from "../../../action-btn/index.vue";
import Header from "../../../../../../components/header/index.vue";

const [visible, onToggle] = useToggle();
</script>

<style lang="scss">
@import "./index.scss";
</style>
