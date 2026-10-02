// Squarified treemap (Bruls, Huizing, van Wijk). Lays out values as rectangles whose
// area is proportional to the value, keeping tiles as close to square as possible.

export type Tile<T> = { x: number; y: number; w: number; h: number; item: T }

type Rect = { x: number; y: number; w: number; h: number }

function worst(row: number[], side: number) {
  const sum = row.reduce((a, b) => a + b, 0)
  const max = Math.max(...row)
  const min = Math.min(...row)
  return Math.max((side * side * max) / (sum * sum), (sum * sum) / (side * side * min))
}

export function squarify<T>(items: T[], value: (item: T) => number, width: number, height: number) {
  const sorted = [...items].sort((a, b) => value(b) - value(a))
  const total = sorted.reduce((sum, item) => sum + value(item), 0)
  const areas = sorted.map((item) => (value(item) / total) * width * height)
  const tiles: Tile<T>[] = []
  const rect: Rect = { x: 0, y: 0, w: width, h: height }

  let row: number[] = []
  let start = 0

  const layoutRow = () => {
    const sum = row.reduce((a, b) => a + b, 0)
    if (rect.w >= rect.h) {
      const colWidth = sum / rect.h
      let y = rect.y
      row.forEach((area, i) => {
        const h = area / colWidth
        tiles.push({ x: rect.x, y, w: colWidth, h, item: sorted[start + i] })
        y += h
      })
      rect.x += colWidth
      rect.w -= colWidth
    } else {
      const rowHeight = sum / rect.w
      let x = rect.x
      row.forEach((area, i) => {
        const w = area / rowHeight
        tiles.push({ x, y: rect.y, w, h: rowHeight, item: sorted[start + i] })
        x += w
      })
      rect.y += rowHeight
      rect.h -= rowHeight
    }
    start += row.length
    row = []
  }

  for (const area of areas) {
    const side = Math.min(rect.w, rect.h)
    if (row.length === 0 || worst([...row, area], side) <= worst(row, side)) {
      row.push(area)
    } else {
      layoutRow()
      row.push(area)
    }
  }
  if (row.length) layoutRow()

  return tiles
}
