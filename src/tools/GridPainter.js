export class GridPainter {
  /**
   *
   * @param {Number} GRID_COL       网格的列数
   * @param {Number} GRID_ROW       网格的行数
   * @param {Number} CELL_SIZE      单元格大小
   * @param {Number} BORDER_WIDTH   单元格边框宽度
   * @param {String} GRID_BG_COLOR  网格背景颜色
   * @param {String} BORDER_COLOR   边框背景颜色
   */
  constructor(
    SVG,
    GRID_COL,
    GRID_ROW,
    CELL_SIZE,
    BORDER_WIDTH,
    GRID_BG_COLOR = '#ddd',
    BORDER_COLOR = '#fff'
  ) {
    this.SVG = SVG
    this.GRID_COL = GRID_COL
    this.GRID_ROW = GRID_ROW
    this.CELL_SIZE = CELL_SIZE
    this.BORDER_WIDTH = BORDER_WIDTH
    this.BORDER_COLOR = BORDER_COLOR
    this.GRID_BG_COLOR = GRID_BG_COLOR

    this.cellMap = []
    for (let i = 0; i < this.GRID_COL; i++) {
      const row = []
      for (let j = 0; j < this.GRID_ROW; j++) {
        row.push(null)
      }
      this.cellMap.push(row)
    }

    this.initGrid()
  }
  initGrid() {
    const { GRID_ROW, GRID_COL, CELL_SIZE, BORDER_WIDTH, BORDER_COLOR, GRID_BG_COLOR } = this
    const svg = this.SVG
    svg.innerHTML = ''

    // 设置网格宽高
    svg.setAttribute('width', GRID_COL * (CELL_SIZE + BORDER_WIDTH) + BORDER_WIDTH)
    svg.setAttribute('height', GRID_ROW * (CELL_SIZE + BORDER_WIDTH) + BORDER_WIDTH)

    // 画横线
    for (let i = 0; i <= GRID_ROW; i++) {
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
      rect.setAttribute('x', 0)
      rect.setAttribute('y', i * (CELL_SIZE + BORDER_WIDTH))
      rect.setAttribute('width', GRID_COL * (CELL_SIZE + BORDER_WIDTH) + BORDER_WIDTH)
      rect.setAttribute('height', BORDER_WIDTH)
      rect.setAttribute('fill', BORDER_COLOR)
      svg.appendChild(rect)
    }

    // 画竖线
    for (let i = 0; i <= GRID_COL; i++) {
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
      rect.setAttribute('x', i * (CELL_SIZE + BORDER_WIDTH))
      rect.setAttribute('y', 0)
      rect.setAttribute('width', BORDER_WIDTH)
      rect.setAttribute('height', GRID_ROW * (CELL_SIZE + BORDER_WIDTH) + BORDER_WIDTH)
      rect.setAttribute('fill', BORDER_COLOR)
      svg.appendChild(rect)
    }

    // 画单元格
    this.initCell()
  }
  drawCell(x, y, { color = '#868686' }) {
    const { GRID_ROW, GRID_COL, CELL_SIZE, BORDER_WIDTH } = this
    if (x >= GRID_COL || y >= GRID_ROW) {
      throw Error('单元格位置不在网格中')
    }

    if (this.cellMap[x][y]) {
      this.cellMap[x][y].setAttribute('fill', color)
      return
    }

    const startX = (CELL_SIZE + BORDER_WIDTH) * x + BORDER_WIDTH
    const startY = (CELL_SIZE + BORDER_WIDTH) * y + BORDER_WIDTH
    const cell = `M${startX} ${startY} H ${startX + CELL_SIZE} V ${startY + CELL_SIZE} H ${startX} V ${startY}`

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    path.setAttribute('d', cell)
    path.setAttribute('fill', color)
    this.SVG.appendChild(path)
    path.addEventListener('click', () => {
      this.onCellClick({ x, y })
    })
    this.cellMap[x][y] = path
  }
  initCell() {
    for (let i = 0; i < this.GRID_COL; i++) {
      for (let j = 0; j < this.GRID_ROW; j++) {
        this.drawCell(i, j, { color: this.GRID_BG_COLOR })
      }
    }
  }
  clearCell(x, y) {
    this.drawCell(x, y, { color: this.GRID_BG_COLOR })
  }
  onCellClick(e) {
    console.log('点击', e)
  }
}

export class AnimationGridPainter extends GridPainter {
  frame = null
  setFrame(frame) {
    this.frame = frame
    this.drawFrame()
  }
  setFrameOnlyColor(frameOnlyColor) {
    const frame = []

    frameOnlyColor.forEach((col) => {
      const arr = []
      col.forEach((cell) => {
        arr.push({ color: cell })
      })

      frame.push(arr)
    })

    this.setFrame(frame)
  }
  drawFrame() {
    for (let i = 0; i < this.frame.length; i++) {
      const col = this.frame[i]
      for (let j = 0; j < col.length; j++) {
        const cell = col[j]
        if (cell) {
          this.drawCell(i, j, cell)
        } else {
          this.clearCell(i, j)
        }
      }
    }
  }
  frameAnimation(frames, stepTime = 1000) {
    let currentFrame = 0
    const timer = setInterval(() => {
      if (currentFrame == frames.length) {
        clearInterval(timer)
        return
      }
      this.setFrame(frames[currentFrame])
      currentFrame++
    }, stepTime)
  }
}
