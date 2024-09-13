export const GIRD_ROW = 6 // 网格行数
export const GIRD_COL = 6 // 网格列数
export const CELL_SIZE = 48 // 单元格大小
export const BORDER_WIDTH = 4 // 边框宽度
export const BORDER_COLOR = '#fff'
export const GRID_BACKAGE_COLOR = '#ddd'

function isLinkTop(data, { x, y }) {
  return y > 0 && data[y - 1][x] === 1
}

function isLinkLeft(data, { x, y }) {
  return x > 0 && data[y][x - 1] === 1
}

function isLinkLeftAbove(data, { x, y }) {
  return x > 0 && y > 0 && data[y - 1][x - 1] === 1
}

function cellPath(data, { x, y }, offset) {
  const startX = (CELL_SIZE + BORDER_WIDTH) * (x + offset.x) + BORDER_WIDTH
  const startY = (CELL_SIZE + BORDER_WIDTH) * (y + offset.y) + BORDER_WIDTH

  const cell = `M${startX} ${startY} H ${startX + CELL_SIZE} V ${startY + CELL_SIZE} H ${startX} V ${startY}`
  let topBorder = ''
  if (isLinkTop(data, { x, y })) {
    topBorder = ` M${startX} ${startY - BORDER_WIDTH} H ${startX + CELL_SIZE} V ${startY} H ${startX} V ${startY - BORDER_WIDTH}`
  }
  let leftBorder = ''
  if (isLinkLeft(data, { x, y })) {
    leftBorder = ` M${startX - BORDER_WIDTH} ${startY} H ${startX} V ${startY + CELL_SIZE} H ${startX - BORDER_WIDTH} V ${startY}`
  }
  let aboveBorder = ''
  if (isLinkTop(data, { x, y }) && isLinkLeft(data, { x, y }) && isLinkLeftAbove(data, { x, y })) {
    aboveBorder = `M${startX - BORDER_WIDTH} ${startY - BORDER_WIDTH} H ${startX} V ${startY} H ${startX - BORDER_WIDTH} V ${startY - BORDER_WIDTH}`
  }

  return cell + topBorder + leftBorder + aboveBorder
}

function gridToSVGPaths(data, offset = { x: 0, y: 0 }) {
  const dArr = []
  for (let y = 0; y < data.length; y++) {
    const row = data[y]
    for (let x = 0; x < row.length; x++) {
      if (data[y][x] === 1) {
        dArr.push(cellPath(data, { x, y }, offset))
      }
    }
  }
  return dArr.join(' ')
}

function drawGrid(svg) {
  const sp = svg.firstChild

  // 画背景
  const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
  rect.setAttribute('x', 0)
  rect.setAttribute('y', 0)
  rect.setAttribute('width', GIRD_COL * (CELL_SIZE + BORDER_WIDTH) + BORDER_WIDTH)
  rect.setAttribute('height', GIRD_ROW * (CELL_SIZE + BORDER_WIDTH) + BORDER_WIDTH)
  rect.setAttribute('fill', GRID_BACKAGE_COLOR)
  svg.insertBefore(rect, sp)

  // 画横线
  for (let i = 0; i <= GIRD_ROW; i++) {
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
    rect.setAttribute('x', 0)
    rect.setAttribute('y', i * (CELL_SIZE + BORDER_WIDTH))
    rect.setAttribute('width', GIRD_COL * (CELL_SIZE + BORDER_WIDTH) + BORDER_WIDTH)
    rect.setAttribute('height', BORDER_WIDTH)
    rect.setAttribute('fill', BORDER_COLOR)
    svg.insertBefore(rect, sp)
  }

  // 画竖线
  for (let i = 0; i <= GIRD_COL; i++) {
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
    rect.setAttribute('x', i * (CELL_SIZE + BORDER_WIDTH))
    rect.setAttribute('y', 0)
    rect.setAttribute('width', BORDER_WIDTH)
    rect.setAttribute('height', GIRD_ROW * (CELL_SIZE + BORDER_WIDTH) + BORDER_WIDTH)
    rect.setAttribute('fill', BORDER_COLOR)
    svg.insertBefore(rect, sp)
  }
}

function initGird(svg) {
  svg.setAttribute('width', GIRD_COL * (CELL_SIZE + BORDER_WIDTH) + BORDER_WIDTH)
  svg.setAttribute('height', GIRD_ROW * (CELL_SIZE + BORDER_WIDTH) + BORDER_WIDTH)
  drawGrid(svg)
}

export { initGird, gridToSVGPaths }
