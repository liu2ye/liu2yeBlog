<script setup>
import request from '@/common/request'
import Markdown from '@/components/Markdown.vue'
import { ref } from 'vue'

const messyCode = ref('')
const resultData = ref([])

function recover(mode) {
  request.get('/messyCodeRecover', { messyCode: messyCode.value, mode }).then((res) => {
    if (res.code == 200) {
      resultData.value = res.data
    }
  })
}
</script>
<template>
  <div class="container mx-auto md:px-4">
    <h2>乱码推测</h2>
    <section>通过使用多种编码对乱码解码来推测乱码原文和原编码</section>

    <div class="flex items-center my-4">
      <span>乱码</span>
      <ElInput class="flex-1 mx-4" v-model="messyCode" />
      <el-tooltip content="仅对常用字符集进行推测,速度较快" placement="top" effect="light">
        <ElButton type="primary" @click="recover('fast')">快速推测</ElButton>
      </el-tooltip>
      <el-tooltip content="对全部字符集进行推测,速度较慢" placement="top" effect="light">
        <ElButton type="primary" @click="recover('full')">完整推测</ElButton>
      </el-tooltip>
      <ElButton @click="resultData = []">清空结果</ElButton>
    </div>

    <el-table :data="resultData" style="width: 100%">
      <el-table-column prop="oriEncode" label="原编码" />
      <el-table-column prop="curEncode" label="当前编码" />
      <el-table-column prop="result" label="结果" />
    </el-table>

    <h2>工具源码</h2>
    <Markdown file-name="tools/messyCodeRecoverSourceCode" />
  </div>
</template>
<style lang="scss" scoped></style>
