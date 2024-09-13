<script setup>
import { useScreensStore } from '@/stores/screens'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import HumButton from './HumButton.vue'

const screensStore = useScreensStore()
const { autoMapping } = screensStore
const { screen } = storeToRefs(screensStore)

const showProfile = ref(false)
const profileSkillType = ref('Java')
const profileDescCol = autoMapping({ sm: 2, md: 3 })


const profileSkill = {
  Java: ['Java基础','SSM','SpringBoot','MySql','MybatisPlus','Redis','RabbitMQ','Shiro','Elasticsearch(了解)'],
  前端: ['HTML','CSS','JS','TS(了解)','Vue3(及相关框架Vite、Pinia)','ElementPlus','uniapp','Android(使用Java语言)'],
  其他: ['C','Python','Electron(了解)','办公软件','PS']
}
</script>
<template>
  <div
    class="mb-10 rd-r-2 bg-teal-50 flex flex-row justify-between items-center transition-all duration-300"
    :class="showProfile ? 'max-h-300 rd-l-2' : 'max-h-20 rd-l-10 overflow-hidden'"
    b="1 solid teal-500"
  >
    <div class="h-100% flex item-center"
    :class="showProfile ? 'w-10 md:h-40 md:w-40' : 'h-20 w-20'"
    >
      <img
        src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/764024/profile/profile-512.jpg"
        class="box-border relative"
        :class="showProfile ? '-left-10 h-20 w-20 md:-left-20 md:h-40 md:w-40' : 'h-20 w-20'"
        b="rd-full 5px solid teal-300"
      />
    </div>
    <div class="self-start flex-1 mx-5px overflow-y-hidden md:mx-15px">
      <div class="h-50px my-15px flex flex-col" md="flex-row items-center">
        <span class="text-sm md:text-xl"><i>liu2ye的个人网站</i></span>
        <span class="text-sm decoration-underline underline-offset-5">
          <span class="hidden md:inline md:ml-10">Email: </span>
          <a href="mailto:liu2ye@outlook.com">liu2ye@outlook.com</a>
        </span>
      </div>

      <div class="mb-5">
        <el-descriptions :column="profileDescCol" direction="vertical" border>
          <el-descriptions-item label="年龄"> 24 </el-descriptions-item>
          <el-descriptions-item label="学历"> 本科 </el-descriptions-item>
          <el-descriptions-item label="经验">
            <el-tag size="small">1年</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="毕业院校" v-if="screen !== 'sm'">
            河南科技大学
          </el-descriptions-item>
          <el-descriptions-item label="电话" v-if="screen !== 'sm'"
            >19071468225</el-descriptions-item
          >
          <el-descriptions-item label="地址"">河南郑州</el-descriptions-item>

          <el-descriptions-item :span="2">
            <template #label>
              <span> 专业技能 </span>
              <span class="custom-style ml-2">
                <el-segmented
                  v-model="profileSkillType"
                  :options="['Java', '前端', '其他']"
                  size="small"
                />
              </span>
            </template>
            <div class="">
              <el-tag class="mr-5px" size="small" v-for="skill in profileSkill[profileSkillType]">{{ skill }}</el-tag>
            </div>
          </el-descriptions-item>
        </el-descriptions>

        <el-link type="primary" target="_blank" underline href="/public/liu2ye-简历.pdf ">👉我的简历.pdf</el-link>
      </div>
    </div>

    <HumButton class="w-8 h-8 mr-5px" md="w-10 h-10 mr-15px" v-model="showProfile" />
  </div>
</template>
<style lang="scss" scoped>
.custom-style .el-segmented {
  --el-segmented-item-selected-color: var(--el-text-color-primary);
  --el-segmented-item-selected-bg-color: var(--warn-color);
  --el-border-radius-base: 16px;
}
</style>
