<template>
  <div class="user-list-container" :style="`width: ${isExpand ? 176 : 0}px`">
    <el-scrollbar>
      <div
        v-for="item in 6"
        :key="item"
        :class="['user-box', item === 3 && 'active']"
      >
        <div class="user-avatar">
          <img
            class="user-avatar-img"
            src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
          />
        </div>
        <div class="user-box-footer">
          <p class="nickname">使命召唤</p>
        </div>
      </div>
    </el-scrollbar>
    <div class="expand-btn" @click="onExpand">
      <i
        :class="['iconfont', isExpand ? 'icon-arrow-right' : 'icon-arrow-left']"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const isExpand = ref(false);

const onExpand = () => {
  isExpand.value = !isExpand.value;
};
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
