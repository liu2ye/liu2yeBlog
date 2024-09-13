<script setup>
import { useScreensStore } from '@/stores/screens'
import { ref } from 'vue'

const screensStore = useScreensStore()
</script>
<template>
  <el-menu
    style="margin-bottom: 1rem"
    mode="horizontal"
    :default-active="$route.path"
    :ellipsis="screensStore.screen == 'sm'"
    router
  >
    <el-menu-item index="/">首页</el-menu-item>
    <div class="flex-grow"></div>
    <el-menu-item index="/proj" disabled>项目</el-menu-item>
    <el-menu-item index="/blog">博客</el-menu-item>
    <el-menu-item index="/algorithm">算法</el-menu-item>
    <el-menu-item index="/tools">工具</el-menu-item>
    <el-menu-item index="/game" disabled>游戏</el-menu-item>
  </el-menu>
</template>
<style lang="scss" scoped></style>
