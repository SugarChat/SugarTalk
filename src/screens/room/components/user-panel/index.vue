<template>
  <div class="user-panel">
    <el-scrollbar>
      <div class="user-list">
        <div class="user-item" v-for="(item, index) in 3" :key="item">
          <div class="user-avatar">
            <img
              class="user-avatar-img"
              src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
            />
          </div>
          <span class="title">使命召唤</span>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<style scoped lang="scss">
@import "./index.scss";
</style>
