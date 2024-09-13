<script setup>
import { ref } from 'vue'

const isArrow = defineModel()
const props = defineProps({
  size: {
    type: Number,
    default: 50
  }
})
</script>
<template>
  <div
    class="hum-btn bg-teal-600 min-w-10px min-h-10px"
    :class="{ active: isArrow }"
    @click="isArrow = !isArrow"
  >
    <span :size="size"></span>
  </div>
</template>
<style lang="scss" scoped>
.hum-btn {
  position: relative;
  border-radius: 50%;
  cursor: pointer;
  transition-duration: 0.3s;

  span {
    width: 60%;
    height: 3%;
    position: absolute;
    background-color: white;
    top: 50%;
    left: 20%;
    animation: to-hamburger 0.3s forwards ease-in-out;
    &::before,
    &::after {
      content: '';
      width: 100%;
      height: 100%;
      position: absolute;
      background-color: white;
      transition-duration: 0.3s;
      transform: rotate(0deg);
      right: 0;
    }
    &::before {
      margin-top: -25%;
    }
    &::after {
      margin-top: 25%;
    }
  }
  &.active {
    span {
      animation: to-arrow 0.3s forwards ease-in-out;
      &::before,
      &::after {
        width: 60%;
        right: -12.3%;
      }
      &::before {
        top: 100%;
        transform: rotate(45deg);
      }
      &::after {
        top: -100%;
        transform: rotate(-45deg);
      }
    }
  }
}

@keyframes to-hamburger {
  from {
    transform: rotate(90deg);
  }
}
@keyframes to-arrow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(90deg);
  }
}
</style>
