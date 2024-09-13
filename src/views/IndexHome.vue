<script setup>
import Profile from '@/components/Profile.vue'
import { RouterLink } from 'vue-router'
</script>
<template>
  <div class="container mx-auto p-10 box-border" md="p-15">
    <section>
      <Profile />
    </section>

    <nav class="grid gap-4" grid="flow-row-dense cols-2" md="grid-cols-3" lg="grid-cols-5">
      <RouterLink
        ribbon-tip="整理中 "
        class="aspect-square p-10 b-rd-2 md:text-2xl hover:text-white shadow-xl transition-all ribbon"
        bg="teal-200 hover:teal-500"
        md="col-span-2 aspect-auto"
        lg="row-span-2"
        >项目</RouterLink
      >
      <RouterLink
        class="aspect-square p-10 b-rd-2 md:text-2xl hover:text-white shadow-xl"
        bg="teal-200 hover:teal-500"
        lg="col-span-2 aspect-auto"
        to="/blog"
        >博客</RouterLink
      >
      <RouterLink
        class="aspect-square p-10 b-rd-2 md:text-2xl hover:text-white shadow-xl"
        bg="teal-200 hover:teal-500"
        lg="col-span-2 aspect-auto"
        to="/algorithm"
      >
        算法
      </RouterLink>
      <RouterLink
        class="aspect-square p-10 b-rd-2 md:text-2xl hover:text-white shadow-xl"
        bg="teal-200 hover:teal-500"
        to="/tools"
        >工具</RouterLink
      >
      <RouterLink
        class="aspect-square p-10 b-rd-2 md:text-2xl hover:text-white shadow-xl ribbon"
        ribbon-tip="建设中"
        bg="teal-200 hover:teal-500"
        >小游戏</RouterLink
      >
    </nav>

    <div class="text-sm text-slate-500 text-nowrap font-normal text-center m-10">
      发现乐趣 学习乐趣 创造乐趣
    </div>
  </div>
</template>
<style lang="scss" scoped>
.ribbon {
  position: relative;
  background-color: var(--disabled-color);
  cursor: not-allowed;
  color: #fff;

  &::after {
    content: attr(ribbon-tip);
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%; /* 飘带宽度 */
    padding: 5px 0;
    background-color: var(--warn-color);
    text-align: center;
    font-size: medium;
  }
}
</style>
