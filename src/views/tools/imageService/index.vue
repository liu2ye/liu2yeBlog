<script setup>
import { getImageFullPath, imageServiceUrl } from '@/common/request'
import { ref } from 'vue'

const upload = ref()
const form = ref({})

function handleExceed(files) {
  upload.value.clearFiles()
  const file = files[0]
  upload.value.handleStart(file)
}

function uploadSuccess(filePath) {
  form.value.filePath = filePath
}
</script>
<template>
  <div class="container mx-auto md:px-4">
    <h2>图床服务</h2>
    <section>提供免费的、公开的图床服务，欢迎使用。</section>
    <section class="tip-warn">
      此图床中的图片都是公开的，任何人都可以获取到你所上传的图片。请确保图片不涉及隐私。
    </section>

    <h3>接口</h3>
    <section class="tip">服务地址: {{ imageServiceUrl }}</section>

    <h4>上传 {{ imageServiceUrl }}/upload</h4>
    <section>
      <p>请求方法 <span class="p-1 rounded bg-#eee text-xs">POST</span></p>
      <p>可选参数 <span class="p-1 rounded bg-#eee text-xs">owner</span></p>
    </section>

    <section>
      上传时可指定owner参数，用以标识拥有者，但是这并不是一种保护，任何人都可以访问到你上传的图片。
    </section>
    <el-form :model="form" label-width="5rem" class="p-4 rounded" b="1 solid black">
      <el-form-item label="拥有人">
        <el-input
          style="width: 10rem"
          v-model="form.owner"
          onkeyup="this.value=this.value.replace(/[^\w_]/g,'');"
          placeholder="[\w]和下划线"
        />
      </el-form-item>

      <el-form-item label="选择图片">
        <el-upload
          ref="upload"
          :action="imageServiceUrl + '/upload' + (form.owner ? '?owner=' + form.owner : '')"
          accept="image/*"
          :limit="1"
          :on-exceed="handleExceed"
          :on-success="uploadSuccess"
          :auto-upload="false"
        >
          <el-button type="primary">选择图片</el-button>
        </el-upload>
      </el-form-item>

      <el-form-item label="上传图片">
        <el-button type="success" @click="$refs.upload.submit()">上传到服务器</el-button>
      </el-form-item>

      <el-form-item label="响应路径">
        {{ form.filePath || '请上传图片' }}
        <div class="flex-1"></div>
        <el-button v-if="form.filePath" @click="form.showImage = form.filePath">
          复制到回显中👇
        </el-button>
      </el-form-item>
    </el-form>

    <h4>回显 {{ imageServiceUrl }}/img/</h4>
    <el-form label-width="auto">
      <el-form-item label="图片地址">
        <el-input v-model="form.showImage" placeholder="请复制上面的响应路径">
          <template #prepend>{{ imageServiceUrl }}/img/</template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <div class="flex-1 flex justify-center">
          <el-image
            class="w-200px h-200px"
            :src="getImageFullPath(form.showImage)"
            fit="scale-down"
          />
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>
<style lang="scss" scoped></style>
