<script setup>
import router from '@/router'
import { useScreensStore } from '@/stores/screens'

const props = defineProps(['title', 'desc', 'cover', 'link'])

const titleLineClamp = useScreensStore().autoMapping({ sm: 2, md: 1 })

function clickHanlder() {
  if (props.link) {
    router.push(props.link)
  }
}
</script>
<template>
  <div
    class="p-4 flex flex-row cursor-pointer hover:bg-gray-100"
    b-b="1 solid gray-300"
    @click="clickHanlder"
  >
    <div class="flex-1 mr-3">
      <div class="title md:text-xl" :style="'-webkit-line-clamp:' + titleLineClamp">
        {{ props.title }}
      </div>
      <div class="hidden md:block desc mt-1 text-gray-500">{{ props.desc }}</div>
    </div>
    <img :src="props.cover" class="w-16 h-16 rd-sm" md="w-20 h-20 rd-md" />
  </div>
</template>
<style lang="scss" scoped>
.title {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
}

@media (min-width: 768px) {
  .desc {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
}
</style>
