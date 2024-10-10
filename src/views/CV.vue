<script setup>
import CurriculumVitae from '@/components/CurriculumVitae.vue'
</script>
<template>
  <div class="min-w-1024px p-10 flex justify-center bg-#ddd">
    <CurriculumVitae class="shadow-2xl"></CurriculumVitae>

    <div class="absolute top-0">
      <a href="/liu2ye-简历.pdf" download="liu2ye-简历.pdf">
        <ElButton type="primary">下载PDF</ElButton>
      </a>
    </div>
  </div>

  <!-- 打印时使用 -->
  <!-- <CurriculumVitae></CurriculumVitae> -->
</template>
<style lang="scss" scoped></style>
