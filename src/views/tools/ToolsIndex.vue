<script setup>
const Tools = [
  {
    icon: 'Compass',
    title: '乱码推测',
    desc: '对于未知编码的乱码进行推测复原'
  },
  {
    icon: 'Grid',
    title: 'SVG网格',
    desc: '在svg中绘画出可自定义的网格, 用以演示二维的变化',
    route: '/tools/gridPainter'
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
        <div>
          <el-icon :size="64" color="#14b8a6">
            <component :is="tool.icon" />
          </el-icon>
        </div>
        <div class="text-lg text-teal-600">{{ tool.title }}</div>
        <div class="text-sm text-gray-400">{{ tool.desc }}</div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped></style>
