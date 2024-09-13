<script setup>
import ListItem from '@/components/ListItem.vue'

const blog = {
  title: 'RuoYi-Vue若依框架-系统监控内定时任务的使用,RuoYi-Vue若依框架-系统监控内定时任务的使用',
  desc: 'JuiceFS 是一款为云环境设计的分布式高性能文件系统。易于使用且可伸缩，适用于多种应用。则是面向处理快速和大规模数据工作负载的高性能文件系统。在本文中，我们将通过一系列测试，来评估这三种主流文件系统的性能与成本表现，帮助用户快速了解这些产品。',
  cover: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/764024/profile/profile-512.jpg'
}
</script>
<template>
  <NavHeader />
  <div class="container mx-auto md:px-4">
    <ListItem v-for="i in 9" v-bind="blog" />

    <div class="m-y-4 flex justify-center">
      <el-pagination layout="prev, pager, next" :total="1000" hide-on-single-page background />
    </div>
  </div>
</template>
<style lang="scss" scoped></style>
