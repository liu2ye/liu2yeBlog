<script async setup>
import { getMdText } from '@/common/request'
import { marked } from '@/tools/marked'
import { ref } from 'vue'

const props = defineProps({
  text: String,
  fileName: String
})

const text = ref(props.text || '')
if (props.fileName) {
  getMdText(props.fileName).then((fileContext) => {
    text.value = fileContext
  })
}
</script>
<template>
  <div class="markdown-body" v-html="marked.parse(text)"></div>
  <!-- 防止unocss不打包marked使用的样式 -->
  <div
    style="display: none"
    class="hidden cursor-pointer flex items-center text-white bg-black/30 absolute top-0 right-0 uppercase font-bold text-xs rounded-bl-md px-2 py-1 bg-teal-950 shadow-xl text-sm relative overflow-hidden max-w-full rounded p-4 text-gray-200"
  ></div>
</template>
<style lang="scss">
pre {
  font-family: Consolas;
}
</style>
