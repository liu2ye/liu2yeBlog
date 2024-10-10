<script setup>
import ListItem from '@/components/ListItem.vue'
import { ref } from 'vue'
import { getBlogs } from './blogApi'

const blogs = ref([])

getBlogs().then((res) => {
  blogs.value = res
})
</script>
<template>
  <NavHeader />
  <div class="container mx-auto mb-8 md:px-4">
    <ListItem v-for="blog in blogs" v-bind="blog" @click="$router.push(blog.link)" />

    <!-- <div class="m-y-4 flex justify-center">
      <el-pagination
        layout="prev, pager, next"
        :total="blogs.length"
        hide-on-single-page
        background
      />
    </div> -->
  </div>
</template>
<style lang="scss" scoped></style>
