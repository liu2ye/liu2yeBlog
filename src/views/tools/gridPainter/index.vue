<script setup>
import { GridPainter, AnimationGridPainter } from '@/tools/GridPainter'
import { onMounted, ref, watch } from 'vue'
import { mnls_frams, xm_frams, nh_frams, tnt_frames } from './frames'
import Markdown from '@/components/Markdown.vue'
import { getMdText } from '@/common/request'

const map = ref()

const col = ref(8)
const row = ref(8)
const cellSize = ref(25)
const borderWidth = ref(2)
const bgColor = ref('#ddd')
const borderColor = ref('#fff')

/**
 * @type GridPainter
 */
let gridPainter = null

function generate() {
  gridPainter = new AnimationGridPainter(
    map.value,
    col.value,
    row.value,
    cellSize.value,
    borderWidth.value,
    bgColor.value,
    borderColor.value
  )

  gridPainter.onCellClick = ({ x, y }) => {
    if (gridPainter.cellMap[x][y].getAttribute('fill') === bgColor.value) {
      gridPainter.drawCell(x, y, '#66ccff')
    } else {
      gridPainter.clearCell(x, y)
    }
  }
}

function frameAnimation() {
  gridPainter.frameAnimation(
    [
      [[{ color: 'hsl(0, 100%, 40%)' }]],
      [[{ color: 'hsl(60, 100%, 40%)' }]],
      [[{ color: 'hsl(120, 100%, 40%)' }]],
      [[{ color: 'hsl(180, 100%, 40%)' }]],
      [[{ color: 'hsl(240, 100%, 40%)' }]],
      [[{ color: 'hsl(300, 100%, 40%)' }]],
      [[{ color: 'hsl(360, 100%, 40%)' }]],
      [[null]]
    ],
    500
  )
}

/**
 * @type AnimationGridPainter
 */
let gridPainter2 = null
const map2 = ref()
const selectFrame = ref('蒙娜丽莎')
function onSelectChange(v) {
  switch (v) {
    case '蒙娜丽莎':
      gridPainter2.setFrameOnlyColor(mnls_frams)
      break
    case '呐喊':
      gridPainter2.setFrameOnlyColor(nh_frams)
      break
    case '小埋':
      gridPainter2.setFrameOnlyColor(xm_frams)
      break
    case 'TNT':
      gridPainter2.setFrameOnlyColor(tnt_frames)
      break
  }
}

onMounted(() => {
  generate()
  gridPainter2 = new AnimationGridPainter(map2.value, 100, 100, 2, 0.2)
  gridPainter2.setFrameOnlyColor(mnls_frams)
})
</script>
<template>
  <div class="container mx-auto py-4">
    <section>一个适合用来演示二维网格操作的工具</section>

    <div class="p-10px">
      <el-form label-width="auto" size="small" inline>
        <el-form-item label="网格列数">
          <el-input-number v-model="col" :min="1" :max="999" :precision="0" />
        </el-form-item>
        <el-form-item label="网格行数">
          <el-input-number v-model="row" :min="1" :max="999" :precision="0" />
        </el-form-item>
        <el-form-item label="单元格大小">
          <el-input-number v-model="cellSize" :min="1" :max="999" :precision="0" />
        </el-form-item>
        <el-form-item label="边框宽度">
          <el-input-number v-model="borderWidth" :min="0.1" :max="999" :step="0.1" :precision="1" />
        </el-form-item>
        <el-form-item label="背景颜色">
          <el-color-picker v-model="bgColor" />
          <span class="text-gray">(空白单元格颜色)</span>
        </el-form-item>
        <el-form-item label="边框颜色">
          <el-color-picker v-model="borderColor" />
          <span class="text-gray">(单元格边框颜色)</span>
        </el-form-item>

        <el-form-item label=" ">
          <ElButton type="primary" @click="generate">确定</ElButton>
          <ElButton @click="gridPainter.initCell()">清空单元格</ElButton>
        </el-form-item>
      </el-form>
    </div>

    <div class="flex flex-col justify-center items-center">
      <span class="text-gray-400 text-sm mb-1">点击单元格可监听到点击事件</span>
      <svg ref="map" border="2px solid b-black"></svg>
    </div>

    <div class="flex flex-col justify-center items-center mt-4">
      <ElButton @click="frameAnimation">帧动画</ElButton>
    </div>

    <div class="flex flex-col justify-center items-center mt-4">
      <span text-gray-400 text-sm mb-1>如果不在意性能甚至可以当成一块屏幕</span>
      <span text-gray-400 text-xs mb-1>👇一块分辨率100*100的模拟屏幕？</span>
      <svg ref="map2" border="2px solid b-black"></svg>

      <div class="flex flex-row justify-center mt-4">
        <el-segmented
          v-model="selectFrame"
          :options="['蒙娜丽莎', '呐喊', 'TNT', '小埋']"
          @change="onSelectChange"
        />
      </div>
    </div>

    <Markdown file-name="GridPainter文档"></Markdown>
  </div>
</template>
<style lang="scss" scoped></style>
