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
  <div v-html="marked.parse(text)"></div>
</template>
<style lang="scss">
pre {
  font-family: Consolas;
}
</style>
