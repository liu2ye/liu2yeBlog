<script setup>
import ListItem from '@/components/ListItem.vue'
import { ref } from 'vue'

const pathfinding = {
  title: 'A*寻路算法',
  desc: '游戏中经常出现的一种功能是：点击地图的一个位置，然后游戏人物将会自动向这个地点走去， 并且在途中会避开障碍物。我查找资料后发现大多是使用一个名为A*的算法，但是这篇文章不会仅介绍A*算法，也会介绍其他能实现此功能的算法：BFS(广度优先搜索)和Dijkstra算法。',
  link: '/algorithm/pathfinding'
}

const blogs = ref([])

blogs.value.push(pathfinding)
</script>
<template>
  <NavHeader />
  <div class="container mx-auto md:px-4">
    <ListItem v-for="blog in blogs" v-bind="blog" />

    <!-- <div class="m-y-4 flex justify-center">
      <el-pagination layout="prev, pager, next" :total="1000" hide-on-single-page background />
    </div> -->
  </div>
</template>
<style lang="scss" scoped></style>
