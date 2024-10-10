<script setup>
import { getMdText } from '@/common/request'
import Markdown from '@/components/Markdown.vue'
import router from '@/router'
import { ref } from 'vue'

const props = defineProps(['blogPath'])

if (!props.blogPath) {
  router.push({ name: 'NotFound' })
}
</script>
<template>
  <div class="container mx-auto">
    <Markdown :file-name="'blog/' + props.blogPath" />
    <p class="mt-8 text-center text-gray-400">-- 欢迎转载，转载请著名作者或本网站链接 --</p>
  </div>
</template>
<style lang="scss" scoped></style>
