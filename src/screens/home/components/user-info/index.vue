<template>
  <div class="home-user-info">
    <el-popover
      popper-class="user-info-popover"
      placement="bottom"
      :width="320"
      trigger="click"
      :show-arrow="true"
    >
      <template #reference>
        <div class="user-avatar">
          <img
            class="user-avatar-img"
            src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
          />
        </div>
      </template>
      <div class="user-info-container">
        <div class="user-info">
          <div class="user-avatar">
            <img
              class="user-avatar-img"
              src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
            />
          </div>
          <span class="nickname">使命召唤</span>
        </div>
      </div>
      <div class="logout-btn">
        <el-button type="danger" plain @click="onLogout">退出登录</el-button>
      </div>
    </el-popover>
  </div>
</template>

<script setup lang="ts">
interface Emits {
  (event: "logout"): void;
}

const emits = defineEmits<Emits>();

const onLogout = () => emits("logout");
</script>

<style lang="scss">
@import "./index.scss";
</style>
