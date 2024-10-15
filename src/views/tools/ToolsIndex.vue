<script setup>
const Tools = [
  {
    icon: 'i-ep-compass',
    title: '乱码推测',
    desc: '对于未知编码的乱码进行推测复原',
    route: '/tools/messyCodeRecover'
  },
  {
    icon: 'i-ep-grid',
    title: 'SVG网格',
    desc: '在svg中绘画出可自定义的网格, 用以演示二维的变化',
    route: '/tools/gridPainter'
  },
  {
    icon: 'i-ep-picture-filled',
    title: '图床服务',
    desc: '提供免费图床服务，欢迎使用',
    route: '/tools/imageService'
  },
  {
    icon: 'i-ep-clock',
    title: '时钟',
    desc: '简易CSS时钟',
    route: '/tools/simpleClock'
  }
]
</script>
<template>
  <NavHeader />
  <div class="container mx-auto">
    <div class="grid gap-4" grid="cols-1" md="grid-cols-3">
      <div
        class="p-4 b-rd-2 text-center cursor-pointer hover:shadow-xl"
        v-for="tool in Tools"
        @click="$router.push(tool.route)"
      >
        <el-icon :size="64" color="#14b8a6">
          <div :class="tool.icon"></div>
        </el-icon>
        <div class="text-lg text-teal-600">{{ tool.title }}</div>
        <div class="text-sm text-gray-400">{{ tool.desc }}</div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped></style>
