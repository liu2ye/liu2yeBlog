import { defineStore } from 'pinia'
import { useWindowSize } from '@vueuse/core'
import { computed, ref, watch } from 'vue'
const { width } = useWindowSize()

/**
 * @typedef ScreenEnum
 * @type {'sm' | 'md' | 'lg' | 'xl'  | '2xl'}
 */

/**
 * 根据屏幕宽度获取屏幕大小标签
 * @returns {ScreenEnum}
 */
function getLabelByScreenWidth() {
  if (width.value < 768) {
    return 'sm'
  }
  if (width.value < 1024) {
    return 'md'
  }
  if (width.value < 1280) {
    return 'lg'
  }
  if (width.value < 1536) {
    return 'xl'
  }
  return '2xl'
}

const AllScreen = ['sm', 'md', 'lg', 'xl', '2xl']
function getValueByScreen(curScreen, map) {
  return map[curScreen] || getValueByScreen(AllScreen[AllScreen.indexOf(curScreen) - 1], map)
}

export const useScreensStore = defineStore('screens', () => {
  const screen = ref(getLabelByScreenWidth())
  function update() {
    screen.value = getLabelByScreenWidth()
  }

  /**
   *
   * @param {Record<ScreenEnum, any>} map 必须传递map.sm的值作为保底
   * @returns {import('vue').ComputedRef<any>}
   */
  function autoMapping(map) {
    return computed(() => getValueByScreen(screen.value, map))
  }
  return { screen, update, autoMapping }
})

const screensStore = useScreensStore()
watch(width, screensStore.update)
