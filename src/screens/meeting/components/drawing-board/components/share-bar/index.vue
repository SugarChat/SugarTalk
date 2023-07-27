<template>
  <div class="share-bar">
    <div class="share-bar-container">
      <p class="title">您正在观看{{ props.currentShareUser.userName }}的屏幕</p>
      <el-dropdown @command="handleCommand">
        <div class="action-btn">
          <i class="iconfont icon-menu" />
        </div>
        <template #dropdown>
          <el-dropdown-menu v-for="menu in menus" :key="menu.command">
            <el-dropdown-item :command="menu.command">{{
              menu.title
            }}</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { UserSession } from "../../../../../../entity/response";

interface Props {
  currentShareUser: UserSession;
}

enum MenuEnum {
  Drawing,
}

interface Emits {
  (event: "toggleDrawingTool"): void;
}

const props = defineProps<Props>();

const emits = defineEmits<Emits>();

const menus = ref([
  {
    title: "互动批注",
    command: MenuEnum.Drawing,
  },
]);

const handleCommand = (command: MenuEnum) => {
  if (command === MenuEnum.Drawing) {
    emits("toggleDrawingTool");
  }
};
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
