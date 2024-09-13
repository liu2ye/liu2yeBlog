<script setup></script>
<template>
  <NavHeader />
  <div class="container mx-auto">
    <div class="grid gap-4" grid="cols-1" md="grid-cols-3">
      <div class="p-4 b-rd-2 text-center cursor-pointer hover:shadow-xl">
        <div>
          <el-icon :size="64" color="#14b8a6">
            <Compass />
          </el-icon>
        </div>
        <div class="text-lg text-teal-600">乱码推测</div>
        <div class="text-sm text-gray-400">对于未知编码的乱码进行推测复原</div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped></style>
