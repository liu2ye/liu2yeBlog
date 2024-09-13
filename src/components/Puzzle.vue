<script setup>
import { gridToSVGPaths, CELL_SIZE, BORDER_WIDTH } from '@/views/puzzle/puzzleUtil'
import { computed, ref } from 'vue'

const props = defineProps({
  data: {
    reqired: true,
    type: Array,
    validator(value, props) {
      if (!Array.isArray(value)) {
        return false
      }

      for (const item of value) {
        if (!Array.isArray(value)) {
          return false
        }
      }
      return true
    }
  },
  offset: {
    type: Object,
    default() {
      return { x: 0, y: 0 }
    }
  },
  fill: String
})

const isDragging = ref(false)
const dragOffset = ref({ x: 0, y: 0 })
const dragStartClient = { x: 0, y: 0 }

function dragStart(event) {
  isDragging.value = true
  dragStartClient.x = event.clientX
  dragStartClient.y = event.clientY
}

function drag(event) {
  if (!isDragging.value) {
    return
  }
  const { clientX, clientY } = event
  console.log(event)

  dragOffset.value = {
    x: Math.round((event.clientX - dragStartClient.x) / (CELL_SIZE + BORDER_WIDTH)),
    y: Math.round((event.clientY - dragStartClient.y) / (CELL_SIZE + BORDER_WIDTH))
  }
}

function dragEnd() {
  isDragging.value = false
  dragStartClient.x = 0
  dragStartClient.y = 0
}

const realOffset = computed(() => {
  return {
    x: dragOffset.value.x + props.offset.x,
    y: dragOffset.value.y + props.offset.y
  }
})
</script>
<template>
  <path
    :d="gridToSVGPaths(data, realOffset)"
    :fill="props.fill"
    @mousedown="dragStart"
    @mousemove="drag"
    @mouseup="dragEnd"
  />
</template>
<style lang="scss" scoped></style>
