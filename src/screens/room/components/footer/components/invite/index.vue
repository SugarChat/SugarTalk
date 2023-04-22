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
    <Header title="会议号：335 1774 4914" borderBottom>
      <template #right>
        <div class="invite-header">
          <div class="close-btn" @click="() => onToggle(false)">
            <i class="iconfont icon-close" />
          </div>
        </div>
      </template>
    </Header>
    <div class="invite-body">
      <div class="title">诸葛琴魔 邀请您加入使命召唤的个人会议室</div>
      <div class="invite-item">
        <p>会议号：</p>
        <p>335 1774 4914</p>
      </div>
    </div>
    <div class="invite-footer">
      <el-button class="btn">复制全部信息</el-button>
      <el-button class="btn" type="primary">复制会议号</el-button>
    </div>
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
