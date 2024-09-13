<script setup>
import Puzzle from '@/components/Puzzle.vue'
import { gridToSVGPaths, initGird } from './puzzleUtil'
import { onMounted, ref } from 'vue'

const PuzzleBoard = ref()

onMounted(() => {
  initGird(PuzzleBoard.value)
})
</script>
<template>
  <div style="padding: 10px; display: flex; flex-direction: column; align-items: center">
    <div>
      <svg
        ref="PuzzleBoard"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        style="border: 2px solid"
      >
        <!-- 此行之上为网格, 之下为拼图 -->
        <path id="sp" />

        <Puzzle
          :data="[
            [0, 1, 0],
            [1, 1, 1]
          ]"
          fill="#ff666671"
        />
        <Puzzle :data="[[1, 1], [1], [1]]" :offset="{ x: 1, y: 2 }" fill="#66ccff71" />
        <Puzzle :data="[[1, 1, 1], [1]]" :offset="{ x: 3, y: 0 }" fill="#ccbb4471" />
        <Puzzle
          :data="[
            [1, 1, 1],
            [0, 0, 1]
          ]"
          :offset="{ x: 3, y: 2 }"
          fill="#3333ff71"
        />
        <Puzzle
          :data="[
            [1, 1],
            [1, 1]
          ]"
          :offset="{ x: 3, y: 4 }"
          fill="#ff333371"
        />
      </svg>
    </div>
  </div>
</template>
<style lang="scss" scoped></style>
