<script setup>
import Markdown from '@/components/Markdown.vue'
import { GridPainter, AnimationGridPainter } from '@/tools/GridPainter'
import { onMounted, ref } from 'vue'
import {
  bfsAndDfs,
  bfsWithPath,
  CODE,
  dijkstra,
  explain,
  gbfs,
  dijkstraWithObstacles,
  gbfsWithObstacles,
  aStar
} from './pathfinding'
import vOnLoad from '@/directives/vOnLoad'

const bfsAndDfsOpt = ref()
const bfsWithPathOpt = ref()
const dijkstraOpt = ref()
const gbfsOpt = ref()
const dijkstraWithObstaclesOpt = ref()
const gbfsWithObstaclesOpt = ref()

const aStarOpt = ref()
function dijkstraAndGbfsAnim() {
  dijkstraWithObstaclesOpt.value.anim()
  gbfsWithObstaclesOpt.value.anim()
}
</script>
<template>
  <div class="max-w-150 mx-auto">
    <h1>寻路算法</h1>
    <section>
      游戏中经常出现的一种功能是：点击地图的一个位置，然后游戏人物将会自动向这个地点走去，
      并且在途中会避开障碍物。
      我查找资料后发现大多是使用一个名为A*的算法，但是这篇文章不会仅介绍A*算法，
      也会介绍其他能实现此功能的算法：BFS(广度优先搜索)和Dijkstra算法。
    </section>
    <section>
      首先是地图，我这里使用网格来表示地图，因为它很简单，只需要使用一个二维数组即可，
      为此我写了一个
      <ElLink href="/tools/gridPainter" target="_blank">网格工具</ElLink>
      来快速构造我需要的网格。当然，算法最重要的是思想，使用“图”或其他数据结构也是可以的。
      只是网格很方便。
    </section>
    <section>如下图，绿色代表起始位置；蓝色代表目标位置；红色表示障碍物；灰色表示路径。</section>

    <div class="flex justify-center">
      <svg style="border: 2px solid" v-on-load="explain"></svg>
    </div>

    <h2>广度优先搜索</h2>
    <section>
      对于网格上的一格，它都有上下左右四个可到达的位置（在边缘处会减少），这些临近点也有它们的临近点，
      这样就形成了一层层的类似于树型的结构。
      我们只要遍历这棵树找到目标位置就能得到从起始点到目标点的路径。
    </section>
    <section>
      使用bfs和深度优先搜索(dfs)都可以遍历树型结构，为什么不使用dfs呢？
      原因是使用bfs类似于沿着起始位置一圈一圈寻找目标，而dfs则是一条路走到黑，
      找不到目标再从最近的岔路口开始深入，很明显是不如bfs的。
    </section>
    <div class="flex flex-col items-center my-4">
      <svg style="border: 2px solid" v-on-load="(el) => (bfsAndDfsOpt = bfsAndDfs(el))"></svg>
      <div class="mt-4">
        <ElButton @click="bfsAndDfsOpt.bfsAnim()">BFS搜索过程</ElButton>
        <ElButton @click="bfsAndDfsOpt.dfsAnim()">DFS搜索过程</ElButton>
      </div>
    </div>

    <Markdown :text="CODE.bfsAnfDfs" />

    <section>
      上述的代码会将整个地图完全的遍历一遍。如果我们需要找到目标后立即结束的话也非常简单，
      只需要在一个点进入reached集合时判断其是否为目标点即可，
      你可能注意到了，位置坐标进入reached的顺序也正好是搜索的顺序。
      我正是利用这一点来制作上面的动画的^_^
    </section>

    <h2>躲避障碍物</h2>
    <section>
      人生总是充满坎坷，地图也是。对于bfs来说，躲避障碍物是非常简单的，
      我们只要修改getNeighbors函数，在其中判断哪些“邻居”是障碍物，并排除即可。就像处理地图边界那样。
    </section>

    <Markdown :text="CODE.getNeighbors" />

    <h2>确定路径</h2>
    <section>
      我们从起始点开始，找到了目标点，但是并没有记录路径。
      别忘了，我们将地图抽象成了一颗树，并且这颗树的根节点是起始位置，
      那么我们只需要记录每个节点的父节点是谁，在到达目标位置时就可以通过回溯确定路径了。
    </section>

    <div class="flex flex-col items-center my-4">
      <svg style="border: 2px solid" v-on-load="(el) => (bfsWithPathOpt = bfsWithPath(el))"></svg>
      <div class="mt-4">
        <ElButton @click="bfsWithPathOpt.anim()">躲避障碍物并确定路线</ElButton>
      </div>
    </div>

    <h2>权重地图与Dijkstra算法</h2>
    <section>
      现在我们有了最简单的寻路算法，它可以躲避障碍物，找到目标位置并通过回溯来确定路径。
      但是有很多时候障碍物是可以翻越的，只是需要耗费更多的时间或者花费更多的成本。
      比如：在平地上一单位时间可以移动一格，在丘陵上可能就只能移动半格了。不同的地形往往差距巨大。
      我们就需要修改我们的地图了，现在每个格子上不再有障碍物，而是通过此格需要花费的成本。
      现在，我们升级了地图：将障碍物划变成了可计算的权重。 说到权重，就不得不考虑Dijkstra算法了吧。
    </section>

    <div class="flex flex-col items-center my-4">
      <svg style="border: 2px solid" v-on-load="(el) => (dijkstraOpt = dijkstra(el))"></svg>
      <div class="mt-4">
        <ElButton @click="dijkstraOpt.anim()">Dijkstra搜索过程</ElButton>
      </div>
    </div>

    <h2>贪婪最佳优先搜索</h2>
    <section>
      对于bfs和Dijkstra算法，它们都是向四个方向搜索的，更多的时候我们只需要其向目标方向搜索。
      依然使用优先队列，但是权重的计算改为和目标之间的距离。 为了方便，权重的计算公式为: [(x1-x2)^2
      + (y1-y2)^2]。没有开平方。
    </section>

    <div class="flex flex-col items-center my-4">
      <svg style="border: 2px solid" v-on-load="(el) => (gbfsOpt = gbfs(el))"></svg>
      <div class="mt-4">
        <ElButton @click="gbfsOpt.anim()">贪婪最佳搜索过程</ElButton>
      </div>
    </div>

    <section>
      贪心很好，但是在有很多障碍物的地图中可能会走弯路。
      贪心虽然比Dijkstra搜索的区域少了很多，但是最终确定的路径绕远了。
    </section>

    <div class="flex flex-col items-center my-4">
      <div class="w-100% flex flex-col justify-between md:flex-row">
        <div class="flex flex-col items-center">
          <span class="mb-1" style="color: var(--text-color)">Dijkstra</span>
          <svg
            style="border: 2px solid"
            v-on-load="(el) => (dijkstraWithObstaclesOpt = dijkstraWithObstacles(el))"
          ></svg>
        </div>
        <div class="flex flex-col items-center">
          <span class="mb-1" style="color: var(--text-color)">贪婪</span>
          <svg
            style="border: 2px solid"
            v-on-load="(el) => (gbfsWithObstaclesOpt = gbfsWithObstacles(el))"
          ></svg>
        </div>
      </div>
      <div class="mt-4">
        <ElButton @click="dijkstraAndGbfsAnim">对比</ElButton>
      </div>
    </div>

    <h2>A*算法</h2>
    <section>
      贪婪快，Dijkstra好。怎样才能又快又好呢？融合。
      在贪婪算法中我们使用到目标点的距离作为点在优先队列的值。
      在Dijkstra中使用成本作为点在优先队列的值。 将两者相加，就获取到了一个折中的、两者兼顾的值。
      A*算法的关键就是这个获取优先队列的值的启发函数。启发函数的好坏直接影响算法的效果。
    </section>

    <div class="flex flex-col items-center my-4">
      <svg style="border: 2px solid" v-on-load="(el) => (aStarOpt = aStar(el))"></svg>
      <div class="mt-4">
        <ElButton @click="aStarOpt.anim()">A*搜索过程</ElButton>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped></style>
