import { GridPainter, AnimationGridPainter } from '@/tools/GridPainter'
export const startColor = '#33aa33'
export const targetColor = '#3333aa'
export const obstacleColor = '#aa3333'
export const pathColor = '#bbb'
export const pathColor2 = '#666'

function drawObstacle(grid, ...points) {
  points.forEach((point) => {
    grid.drawCell(point[0], point[1], { color: obstacleColor })
  })
}

function drawPath(grid, ...points) {
  points.forEach((point) => {
    grid.drawCell(point[0], point[1], { color: pathColor })
  })
}

/**
 * @param {string} point
 */
function parsePoint(point) {
  return point.split(',').map((s) => parseInt(s))
}

function pointEq(p1, p2) {
  return p1[0] === p2[0] && p1[1] === p2[1]
}

/**
 *
 * @param {AnimationGridPainter} grid
 * @param {Number[]} start
 * @param {Number[]} target
 * @param {Number[][]} searchPaths
 * @param {Number[][]} obstacles
 * @param {Number[][]} paths
 */
async function searchAnim(grid, start, target, searchPaths, obstacles, paths) {
  grid.stopAnimation()
  grid.initCell()
  if (start) {
    grid.drawCell(start[0], start[1], { color: startColor })
  }
  if (target) {
    grid.drawCell(target[0], target[1], { color: targetColor })
  }

  if (obstacles) {
    drawObstacle(grid, ...obstacles)
  }

  await grid.cellAnimation(
    searchPaths.map((point) => {
      return {
        x: point[0],
        y: point[1],
        color: pathColor
      }
    }),
    200
  )
  if (paths) {
    grid.cellAnimation(
      paths.map((point) => {
        return {
          x: point[0],
          y: point[1],
          color: pathColor2
        }
      }),
      300
    )
  }
}

function backtrack(prePoint, start, target) {
  const paths = []
  let pre = target
  while (true) {
    pre = prePoint[pre.toString()]
    if (pointEq(pre, start)) {
      break
    }
    paths.push(pre)
  }
  return paths
}

export function explain(svg) {
  const grid = new GridPainter(svg, 8, 8, 20, 2)
  grid.drawCell(1, 1, { color: startColor })
  grid.drawCell(1, 6, { color: targetColor })
  const obstacles = [
    [0, 3],
    [1, 3],
    [2, 3],
    [3, 3],
    [4, 3],
    [4, 0],
    [4, 1],
    [4, 5],
    [4, 6]
  ]
  const paths = [
    [1, 2],
    [2, 2],
    [3, 2],
    [4, 2],
    [5, 2],
    [1, 4],
    [2, 4],
    [3, 4],
    [4, 4],
    [5, 4],
    [5, 3],
    [1, 5]
  ]
  drawObstacle(grid, ...obstacles)
  drawPath(grid, ...paths)
}

export function bfsAndDfs(svg) {
  const mapSize = 8
  const grid = new AnimationGridPainter(svg, mapSize, mapSize, 20, 2)
  const start = [3, 3]

  grid.drawCell(start[0], start[1], { color: startColor })

  /**
   * @param {Number} mapSize 地图尺寸 此处为 8
   * @param {Number[]} start 起始点 此处为[3, 3]
   */
  function bfsSearch(mapSize, start) {
    const frontier = [] // 等待搜索的队列
    const reached = new Set() // 已经搜索过的点, 用于防止重复查找
    frontier.push(start) // js没有Java中的equal方法，所以我们直接使用toString()后续再转换回坐标
    reached.add(start.toString())

    while (frontier.length > 0) {
      const current = frontier.shift()
      for (const neighbor of getNeighbors(current, mapSize)) {
        // 如果此邻居已被被添加到搜索队列中，则不再处理，防止重复搜索死循环
        if (!reached.has(neighbor.toString())) {
          frontier.push(neighbor)
          reached.add(neighbor.toString())
        }
      }
    }

    // reached中的存储顺序就为搜索顺序, js的Set对象是有序的, 其他语言需要额外处理
    const paths = Array.from(reached).map(parsePoint)
    paths.shift() // 去除起始点
    return paths
  }

  /**
   * @param {Number} mapSize 地图尺寸 此处为 8
   * @param {Number[]} start 起始点 此处为[3, 3]
   */
  function dfsSearch(mapSize, start) {
    const reached = new Set()
    reached.add(start.toString())

    function search(point) {
      for (const neighbor of getNeighbors(point, mapSize)) {
        if (!reached.has(neighbor.toString())) {
          reached.add(neighbor.toString())
          search(neighbor)
        }
      }
    }

    search(start)
    // reached中的存储顺序就为搜索顺序, js的Set对象是有序的, 其他语言需要额外处理
    const paths = Array.from(reached).map(parsePoint)
    paths.shift() // 去除起始点
    return paths
  }

  // 获取点的临近点
  function getNeighbors(point, mapSize) {
    const neighbors = []
    if (point[1] > 0) {
      neighbors.push([point[0], point[1] - 1])
    }
    if (point[0] < mapSize - 1) {
      neighbors.push([point[0] + 1, point[1]])
    }
    if (point[1] < mapSize - 1) {
      neighbors.push([point[0], point[1] + 1])
    }
    if (point[0] > 0) {
      neighbors.push([point[0] - 1, point[1]])
    }
    return neighbors
  }

  const bfsPaths = bfsSearch(mapSize, start)
  const dfsPaths = dfsSearch(mapSize, start)
  function bfsAnim() {
    searchAnim(grid, start, null, bfsPaths)
  }
  function dfsAnim() {
    searchAnim(grid, start, null, dfsPaths)
  }

  return { bfsPaths, dfsAnim, bfsAnim, dfsAnim }
}

export function bfsWithPath(svg) {
  const mapSize = 8
  const grid = new AnimationGridPainter(svg, mapSize, mapSize, 20, 2)
  const start = [1, 1]
  const target = [7, 3]
  const obstacles = [
    [0, 3],
    [1, 3],
    [2, 3],
    [3, 3],
    [3, 4],
    [4, 1],
    [5, 1],
    [6, 1],
    [7, 1],
    [5, 2],
    [5, 3],
    [5, 4],
    [5, 5],
    [5, 6],
    [4, 6]
  ]
  grid.drawCell(start[0], start[1], { color: startColor })
  grid.drawCell(target[0], target[1], { color: targetColor })
  drawObstacle(grid, ...obstacles)

  function search(mapSize, start, target) {
    const frontier = [] // 等待搜索的队列
    const reached = new Set() // 已经搜索过的点, 用于防止重复查找
    const prePoint = {} // 记录到达该点的前的位置
    frontier.push(start)
    reached.add(start.toString()) // js没有Java中的equal方法，所以我们直接使用toString()后续再转换回坐标
    prePoint[start.toString()] = undefined // 起始点没有前点

    loop: while (frontier.length > 0) {
      const current = frontier.shift()
      for (const neighbor of getNeighbors(current, mapSize)) {
        if (!reached.has(neighbor.toString())) {
          prePoint[neighbor.toString()] = current // 设置该点的前点
          if (pointEq(neighbor, target)) break loop // 找到了目标点，结束寻找
          frontier.push(neighbor)
          reached.add(neighbor.toString())
        }
      }
    }
    // reached中的存储顺序就为搜索顺序, js的Set对象是有序的, 其他语言需要额外处理
    const searchPaths = Array.from(reached).map(parsePoint)
    searchPaths.shift() // 去除起始点

    // 回溯路线
    const paths = []
    let pre = target
    while (true) {
      pre = prePoint[pre.toString()]
      if (pointEq(pre, start)) {
        break
      }
      paths.push(pre)
    }
    return { paths, searchPaths }
  }

  function getNeighbors(point, mapSize) {
    const neighbors = []
    if (point[1] > 0) {
      neighbors.push([point[0], point[1] - 1])
    }
    if (point[0] < mapSize - 1) {
      neighbors.push([point[0] + 1, point[1]])
    }
    if (point[1] < mapSize - 1) {
      neighbors.push([point[0], point[1] + 1])
    }
    if (point[0] > 0) {
      neighbors.push([point[0] - 1, point[1]])
    }

    // 将障碍物去除
    return neighbors.filter(
      (point) => obstacles.findIndex((obs) => obs[0] == point[0] && obs[1] == point[1]) < 0
    )
  }

  const { paths, searchPaths } = search(mapSize, start, target)
  function anim() {
    searchAnim(grid, start, target, searchPaths, obstacles, paths)
  }

  return { anim }
}

class PriorityQueue {
  item = {}
  w = {}
  put(item, w) {
    const key = item.toString()
    this.item[key] = item
    this.w[key] = w
  }
  get() {
    if (this.size() === 0) {
      return null
    }

    let minKey = null
    let min = Number.MAX_VALUE

    for (const key in this.w) {
      if (this.w[key] < min) {
        min = this.w[key]
        minKey = key
      }
    }
    const minItem = this.item[minKey]
    delete this.w[minKey]
    delete this.item[minKey]
    return { item: minItem, w: min }
  }
  size() {
    return Object.keys(this.w).length
  }
}

export function dijkstra(svg) {
  const mapSize = 12
  const grid = new AnimationGridPainter(svg, mapSize, mapSize, 20, 2)
  const start = [1, 5]
  const target = [10, 5]

  function getWeightMap(size) {
    const map = []
    for (let i = 0; i < size; i++) {
      const col = []
      for (let j = 0; j < size; j++) {
        if (4 <= i && i <= 8 && 4 <= j && j <= 8) {
          col.push(Math.ceil(Math.random() * 20) + 1)
        } else {
          col.push(1)
        }
      }
      map.push(col)
    }
    map[start[0]][start[1]] = 0
    return map
  }

  const dijkstraWeightMap = getWeightMap(12)

  grid.drawCell(start[0], start[1], { color: startColor })
  grid.drawCell(target[0], target[1], { color: targetColor })
  for (let i = 0; i < dijkstraWeightMap.length; i++) {
    for (let j = 0; j < dijkstraWeightMap.length; j++) {
      grid.drawText(i, j, dijkstraWeightMap[i][j])
    }
  }

  function search(mapSize, start, weightMap) {
    // 优先队列
    const frontier = new PriorityQueue()
    const reached = new Set() // 已经搜索过的点, 用于防止重复查找
    const prePoint = {} // 记录到达该点的前的位置
    const cost = {} // 记录到达某点的花费
    frontier.put(start, 0)
    reached.add(start.toString())
    prePoint[start.toString()] = undefined // 起始点没有前点
    cost[start.toString()] = 0

    const searchPaths = []
    loop: while (frontier.size() > 0) {
      const { item: current } = frontier.get()
      searchPaths.push(current)
      for (const neighbor of getNeighbors(current, mapSize)) {
        const newCost = cost[current.toString()] + weightMap[neighbor[0]][neighbor[1]]
        if (!reached.has(neighbor.toString()) || newCost < cost[neighbor.toString()]) {
          frontier.put(neighbor, newCost)
          prePoint[neighbor.toString()] = current // 设置该点的前点
          if (pointEq(neighbor, target)) break loop // 找到了目标点，结束寻找
          cost[neighbor.toString()] = newCost
          reached.add(neighbor.toString())
        }
      }
    }

    searchPaths.shift() // 去除起始点

    return { paths: backtrack(prePoint, start, target), searchPaths, cost }
  }

  function getNeighbors(point, mapSize) {
    const neighbors = []
    if (point[1] > 0) {
      neighbors.push([point[0], point[1] - 1])
    }
    if (point[0] < mapSize - 1) {
      neighbors.push([point[0] + 1, point[1]])
    }
    if (point[1] < mapSize - 1) {
      neighbors.push([point[0], point[1] + 1])
    }
    if (point[0] > 0) {
      neighbors.push([point[0] - 1, point[1]])
    }
    return neighbors
  }

  const { searchPaths, cost, paths } = search(mapSize, start, dijkstraWeightMap)

  function anim() {
    searchAnim(grid, start, target, searchPaths, null, paths)
  }
  return { anim }
}

export function gbfs(svg) {
  const mapSize = 12
  const grid = new AnimationGridPainter(svg, mapSize, mapSize, 20, 2)
  const start = [1, 1]
  const target = [8, 9]

  grid.drawCell(start[0], start[1], { color: startColor })
  grid.drawCell(target[0], target[1], { color: targetColor })
  for (let i = 0; i < mapSize; i++) {
    for (let j = 0; j < mapSize; j++) {
      grid.drawText(i, j, heuristic([i, j], target))
    }
  }

  function heuristic(a, b) {
    return Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2)
  }

  function search(mapSize, start) {
    // 优先队列
    const frontier = new PriorityQueue()
    const reached = new Set() // 已经搜索过的点, 用于防止重复查找
    const prePoint = {} // 记录到达该点的前的位置
    const cost = {} // 记录到达某点的花费
    frontier.put(start, 0)
    reached.add(start.toString())
    prePoint[start.toString()] = undefined // 起始点没有前点
    cost[start.toString()] = 0

    const searchPaths = []
    loop: while (frontier.size() > 0) {
      const { item: current } = frontier.get()
      searchPaths.push(current)
      for (const neighbor of getNeighbors(current, mapSize)) {
        const newCost = heuristic(target, [neighbor[0], neighbor[1]])
        if (!reached.has(neighbor.toString()) || newCost < cost[neighbor.toString()]) {
          frontier.put(neighbor, newCost)
          prePoint[neighbor.toString()] = current // 设置该点的前点
          if (pointEq(neighbor, target)) break loop // 找到了目标点，结束寻找
          cost[neighbor.toString()] = newCost
          reached.add(neighbor.toString())
        }
      }
    }

    searchPaths.shift() // 去除起始点

    return { paths: backtrack(prePoint, start, target), searchPaths, cost }
  }

  function getNeighbors(point, mapSize) {
    const neighbors = []
    if (point[1] > 0) {
      neighbors.push([point[0], point[1] - 1])
    }
    if (point[0] < mapSize - 1) {
      neighbors.push([point[0] + 1, point[1]])
    }
    if (point[1] < mapSize - 1) {
      neighbors.push([point[0], point[1] + 1])
    }
    if (point[0] > 0) {
      neighbors.push([point[0] - 1, point[1]])
    }
    return neighbors
  }

  const { searchPaths, cost, paths } = search(mapSize, start)

  function anim() {
    searchAnim(grid, start, target, searchPaths, null, paths)
  }
  return { anim }
}

const gbfsObstacles = [
  [2, 2],
  [3, 2],
  [4, 2],
  [5, 2],
  [6, 2],
  [7, 2],
  [8, 2],
  [9, 2],
  [5, 9],
  [6, 9],
  [7, 9],
  [8, 9],
  [9, 9],
  [9, 3],
  [9, 4],
  [9, 5],
  [9, 6],
  [9, 7],
  [9, 8]
]

function hasPoint(arr, point) {
  return arr.findIndex((item) => item[0] === point[0] && item[1] === point[1]) >= 0
}

export function dijkstraWithObstacles(svg) {
  const mapSize = 12
  const grid = new AnimationGridPainter(svg, mapSize, mapSize, 20, 2)
  const start = [0, 2]
  const target = [10, 10]

  function getWeightMap(size) {
    const map = []
    for (let i = 0; i < size; i++) {
      const col = []
      for (let j = 0; j < size; j++) {
        if (hasPoint(gbfsObstacles, [i, j])) {
          col.push(999)
        } else {
          col.push(1)
        }
      }
      map.push(col)
    }
    map[start[0]][start[1]] = 0
    return map
  }

  const dijkstraWeightMap = getWeightMap(12)

  grid.drawCell(start[0], start[1], { color: startColor })
  grid.drawCell(target[0], target[1], { color: targetColor })
  drawObstacle(grid, ...gbfsObstacles)

  function search(mapSize, start, weightMap) {
    // 优先队列
    const frontier = new PriorityQueue()
    const reached = new Set() // 已经搜索过的点, 用于防止重复查找
    const prePoint = {} // 记录到达该点的前的位置
    const cost = {} // 记录到达某点的花费
    frontier.put(start, 0)
    reached.add(start.toString())
    prePoint[start.toString()] = undefined // 起始点没有前点
    cost[start.toString()] = 0

    const searchPaths = []
    loop: while (frontier.size() > 0) {
      const { item: current } = frontier.get()
      searchPaths.push(current)

      for (const neighbor of getNeighbors(current, mapSize)) {
        const newCost = cost[current.toString()] + weightMap[neighbor[0]][neighbor[1]]
        if (!reached.has(neighbor.toString()) || newCost < cost[neighbor.toString()]) {
          if (hasPoint(gbfsObstacles, neighbor)) {
            grid.drawText(neighbor[0], neighbor[1], 999)
          } else {
            grid.drawText(neighbor[0], neighbor[1], newCost)
          }

          frontier.put(neighbor, newCost)
          prePoint[neighbor.toString()] = current // 设置该点的前点
          if (pointEq(neighbor, target)) break loop // 找到了目标点，结束寻找
          cost[neighbor.toString()] = newCost
          reached.add(neighbor.toString())
        }
      }
    }

    searchPaths.shift() // 去除起始点

    return { paths: backtrack(prePoint, start, target), searchPaths, cost }
  }

  function getNeighbors(point, mapSize) {
    const neighbors = []
    if (point[1] > 0) {
      neighbors.push([point[0], point[1] - 1])
    }
    if (point[0] < mapSize - 1) {
      neighbors.push([point[0] + 1, point[1]])
    }
    if (point[1] < mapSize - 1) {
      neighbors.push([point[0], point[1] + 1])
    }
    if (point[0] > 0) {
      neighbors.push([point[0] - 1, point[1]])
    }
    return neighbors
  }

  const { searchPaths, cost, paths } = search(mapSize, start, dijkstraWeightMap)

  function anim() {
    searchAnim(grid, start, target, searchPaths, gbfsObstacles, paths)
  }
  return { anim }
}

export function gbfsWithObstacles(svg) {
  const mapSize = 12
  const grid = new AnimationGridPainter(svg, mapSize, mapSize, 20, 2)
  const start = [0, 2]
  const target = [10, 10]

  grid.drawCell(start[0], start[1], { color: startColor })
  grid.drawCell(target[0], target[1], { color: targetColor })
  drawObstacle(grid, ...gbfsObstacles)
  for (let i = 0; i < mapSize; i++) {
    for (let j = 0; j < mapSize; j++) {
      grid.drawText(i, j, heuristic([i, j], target))
    }
  }

  function heuristic(a, b) {
    if (hasPoint(gbfsObstacles, a)) {
      return 999
    } else {
      return Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2)
    }
  }

  function search(mapSize, start) {
    // 优先队列
    const frontier = new PriorityQueue()
    const reached = new Set() // 已经搜索过的点, 用于防止重复查找
    const prePoint = {} // 记录到达该点的前的位置
    const cost = {} // 记录到达某点的花费
    frontier.put(start, 0)
    reached.add(start.toString())
    prePoint[start.toString()] = undefined // 起始点没有前点
    cost[start.toString()] = 0

    const searchPaths = []
    loop: while (frontier.size() > 0) {
      const { item: current } = frontier.get()
      searchPaths.push(current)
      for (const neighbor of getNeighbors(current, mapSize)) {
        const newCost = heuristic(neighbor, target)
        if (!reached.has(neighbor.toString()) || newCost < cost[neighbor.toString()]) {
          frontier.put(neighbor, newCost)
          prePoint[neighbor.toString()] = current // 设置该点的前点
          if (pointEq(neighbor, target)) break loop // 找到了目标点，结束寻找
          cost[neighbor.toString()] = newCost
          reached.add(neighbor.toString())
        }
      }
    }

    searchPaths.shift() // 去除起始点

    return { paths: backtrack(prePoint, start, target), searchPaths, cost }
  }

  function getNeighbors(point, mapSize) {
    const neighbors = []
    if (point[1] > 0) {
      neighbors.push([point[0], point[1] - 1])
    }
    if (point[0] < mapSize - 1) {
      neighbors.push([point[0] + 1, point[1]])
    }
    if (point[1] < mapSize - 1) {
      neighbors.push([point[0], point[1] + 1])
    }
    if (point[0] > 0) {
      neighbors.push([point[0] - 1, point[1]])
    }
    return neighbors
  }

  const { searchPaths, cost, paths } = search(mapSize, start)

  function anim() {
    searchAnim(grid, start, target, searchPaths, gbfsObstacles, paths)
  }
  return { anim }
}

export function aStar(svg) {
  const mapSize = 12
  const grid = new AnimationGridPainter(svg, mapSize, mapSize, 20, 2)
  const start = [0, 2]
  const target = [10, 10]

  function getWeightMap(size) {
    const map = []
    for (let i = 0; i < size; i++) {
      const col = []
      for (let j = 0; j < size; j++) {
        if (hasPoint(gbfsObstacles, [i, j])) {
          col.push(999)
        } else {
          col.push(5)
        }
      }
      map.push(col)
    }
    map[start[0]][start[1]] = 0
    return map
  }

  function heuristic(a, b) {
    return Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2)
  }

  const dijkstraWeightMap = getWeightMap(12)

  grid.drawCell(start[0], start[1], { color: startColor })
  grid.drawCell(target[0], target[1], { color: targetColor })
  drawObstacle(grid, ...gbfsObstacles)

  function search(mapSize, start, weightMap) {
    // 优先队列
    const frontier = new PriorityQueue()
    const reached = new Set() // 已经搜索过的点, 用于防止重复查找
    const prePoint = {} // 记录到达该点的前的位置
    const cost = {} // 记录到达某点的花费
    frontier.put(start, 0)
    reached.add(start.toString())
    prePoint[start.toString()] = undefined // 起始点没有前点
    cost[start.toString()] = 0

    const searchPaths = []
    loop: while (frontier.size() > 0) {
      const { item: current } = frontier.get()
      searchPaths.push(current)
      for (const neighbor of getNeighbors(current, mapSize)) {
        const newCost = cost[current.toString()] + weightMap[neighbor[0]][neighbor[1]]
        if (!reached.has(neighbor.toString()) || newCost < cost[neighbor.toString()]) {
          if (!hasPoint(gbfsObstacles, neighbor)) {
            grid.drawText(neighbor[0], neighbor[1], newCost + heuristic(neighbor, target))
          }

          frontier.put(neighbor, newCost + heuristic(neighbor, target))
          prePoint[neighbor.toString()] = current // 设置该点的前点
          if (pointEq(neighbor, target)) break loop // 找到了目标点，结束寻找
          cost[neighbor.toString()] = newCost
          reached.add(neighbor.toString())
        }
      }
    }

    searchPaths.shift() // 去除起始点

    return { paths: backtrack(prePoint, start, target), searchPaths, cost }
  }

  function getNeighbors(point, mapSize) {
    const neighbors = []
    if (point[1] > 0) {
      neighbors.push([point[0], point[1] - 1])
    }
    if (point[0] < mapSize - 1) {
      neighbors.push([point[0] + 1, point[1]])
    }
    if (point[1] < mapSize - 1) {
      neighbors.push([point[0], point[1] + 1])
    }
    if (point[0] > 0) {
      neighbors.push([point[0] - 1, point[1]])
    }
    return neighbors
  }

  const { searchPaths, cost, paths } = search(mapSize, start, dijkstraWeightMap)

  function anim() {
    searchAnim(grid, start, target, searchPaths, gbfsObstacles, paths)
  }
  return { anim }
}

const mdCodePrefix = '```js'
export const CODE = {
  bfsAnfDfs: `${mdCodePrefix}
  /**
   * @param {Number} mapSize 地图尺寸 此处为 8
   * @param {Number[]} start 起始点 此处为[3, 3]
   */
  function bfsSearch(mapSize, start) {
    const frontier = [] // 等待搜索的队列
    const reached = new Set() // 已经搜索过的点, 用于防止重复查找
    frontier.push(start) // js没有Java中的equal方法，所以我们直接使用toString()后续再转换回坐标
    reached.add(start.toString())

    while (frontier.length > 0) {
      const current = frontier.shift()
      for (const neighbor of getNeighbors(current, mapSize)) {
        // 如果此邻居已被被添加到搜索队列中，则不再处理，防止重复搜索死循环
        if (!reached.has(neighbor.toString())) {
          frontier.push(neighbor)
          reached.add(neighbor.toString())
        }
      }
    }

    // reached中的存储顺序就为搜索顺序, js的Set对象是有序的, 其他语言需要额外处理
    const paths = Array.from(reached).map(parsePoint)
    paths.shift() // 去除起始点
    return paths
  }

  /**
   * @param {Number} mapSize 地图尺寸 此处为 8
   * @param {Number[]} start 起始点 此处为[3, 3]
   */
  function dfsSearch(mapSize, start) {
    const reached = new Set()
    reached.add(start.toString())

    function search(point) {
      for (const neighbor of getNeighbors(point, mapSize)) {
        if (!reached.has(neighbor.toString())) {
          reached.add(neighbor.toString())
          search(neighbor)
        }
      }
    }

    search(start)
    // reached中的存储顺序就为搜索顺序, js的Set对象是有序的, 其他语言需要额外处理
    const paths = Array.from(reached).map(parsePoint)
    paths.shift() // 去除起始点
    return paths
  }

  // 获取点的临近点
  function getNeighbors(point, mapSize) {
    const neighbors = []
    if (point[1] > 0) {
      neighbors.push([point[0], point[1] - 1])
    }
    if (point[0] < mapSize - 1) {
      neighbors.push([point[0] + 1, point[1]])
    }
    if (point[1] < mapSize - 1) {
      neighbors.push([point[0], point[1] + 1])
    }
    if (point[0] > 0) {
      neighbors.push([point[0] - 1, point[1]])
    }
    return neighbors
  }
  `,
  getNeighbors: `${mdCodePrefix}
  function getNeighbors(point, mapSize) {
    const neighbors = []
    if (point[1] > 0) {
      neighbors.push([point[0], point[1] - 1])
    }
    if (point[0] < mapSize - 1) {
      neighbors.push([point[0] + 1, point[1]])
    }
    if (point[1] < mapSize - 1) {
      neighbors.push([point[0], point[1] + 1])
    }
    if (point[0] > 0) {
      neighbors.push([point[0] - 1, point[1]])
    }

    // 将障碍物去除
    return neighbors.filter(
      (point) => obstacles.findIndex((obs) => obs[0] == point[0] && obs[1] == point[1]) < 0
    )
  }
  `
}
