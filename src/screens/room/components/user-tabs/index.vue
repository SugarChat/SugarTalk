<template>
  <div class="user-tabs">
    <div class="user-list">
      <div class="user-item" v-for="(item, index) in 1" :key="item">
        <el-avatar
          :size="72"
          fit="cover"
          src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
        />
        <span class="title">使命召唤</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "./index.scss";
</style>
