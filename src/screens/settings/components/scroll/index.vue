<template>
  <el-scrollbar>
    <div class="scroll-container">
      <slot></slot>
    </div>
  </el-scrollbar>
</template>

<style lang="scss">
.scroll-container {
  padding: 20px 24px;
}
</style>
