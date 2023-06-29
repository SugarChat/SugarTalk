<template>
  <div class="home-user-info">
    <el-popover
      popper-class="user-info-popover"
      placement="bottom"
      :width="320"
      :show-arrow="true"
    >
      <template #reference>
        <div class="user-info">
          <Avatar :size="36" cursor="pointer" :name="appStore.userName" />
          <p class="nickname">{{ appStore.userName }}</p>
        </div>
      </template>
      <div class="user-info-container">
        <div class="user-info">
          <Avatar :size="42" :name="appStore.userName" />
          <span class="nickname">{{ appStore.userName }}</span>
        </div>
      </div>
      <div class="logout-btn">
        <el-button type="danger" plain @click="onLogout">退出登录</el-button>
      </div>
    </el-popover>
  </div>
</template>

<script setup lang="ts">
import Avatar from "../../../../components/avatar/index.vue";
import { useAction } from "./hooks";

interface Emits {
  (event: "logout"): void;
}

const { appStore } = useAction();

const emits = defineEmits<Emits>();

const onLogout = () => emits("logout");
</script>

<style lang="scss">
@import "./index.scss";
</style>
