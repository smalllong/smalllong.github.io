var L = Lightue,
  selecting = false,
  selectStart

function toolButton(content, onclick) {
  return L.button({
    _type: 'button',
    onclick: onclick,
    $$: content,
  })
}

function between(value, min, range) {
  return value >= min && value < min + range
}

function genArr(length, init) {
  return 's'
    .repeat(length)
    .split('')
    .map(() => JSON.parse(JSON.stringify(init)))
}

var mergeManager = {
  table: new Proxy([], {
    get: function (src, key) {
      if (src[key] == null) src[key] = []
      return src[key]
    },
  }), // false: standalone cell, 0: merge header, arr: merged cell
  isGoastCell: function (cell) {
    return cell && !cell.isHeader
  },
  setSpans: function (src, rs, cs) {
    if (typeof src == 'string') src = { v: src }
    src.rs = rs
    src.cs = cs
    return src
  },
  split: function (top, left, height, width, tableState) {
    var tableClone = JSON.parse(JSON.stringify(tableState.slice(top, top + height)))
    this.loopArea(top, left, height, width, tableState, tableClone, (row, col, mcol) => {
      if (this.table[row][col] && this.table[row][col].isHeader)
        tableClone[row - top][mcol] = this.setSpans(tableClone[row - top][mcol], 1, 1)
      else if (this.table[row][col]) tableClone[row - top].splice(mcol, 0, '')
      this.table[row][col] = false
    })
  },
  addMerge: function (top, left, height, width, tableState) {
    var newMerge = [top, left, height, width]
    this.split(...newMerge, tableState)
    var tableClone = JSON.parse(JSON.stringify(tableState.slice(top, top + height)))
    this.loopArea(...newMerge, tableState, tableClone, (row, col, mcol, header) => {
      if (header) tableClone[0][mcol] = this.setSpans(tableClone[0][mcol], height, width)
      else if (!header && !this.table[row][col]) tableClone[row - top].splice(mcol, 1)
      this.table[row][col] = header ? { isHeader: true, rect: newMerge } : { rect: newMerge }
    })
  },
  getVisualCol: function (row, col) {
    var result = -1
    for (; col >= 0; col--) {
      result++
      while (this.isGoastCell(this.table[row][result])) result++
    }
    return result
  },
  getModelCol: function (row, col) {
    var result = 0
    for (var i = 0; i < col; i++) {
      if (!this.isGoastCell(this.table[row][i])) result++
    }
    return result
  },
  include: function (outer, inner) {
    inner = inner && inner.rect
    if (inner) {
      if (inner[0] < outer[0]) {
        outer[2] += outer[0] - inner[0]
        outer[0] = inner[0]
      }
      if (inner[1] < outer[1]) {
        outer[3] += outer[1] - inner[1]
        outer[1] = inner[1]
      }
      if (inner[2] + inner[0] > outer[2] + outer[0]) outer[2] = inner[2] + inner[0] - outer[0]
      if (inner[3] + inner[1] > outer[3] + outer[1]) outer[3] = inner[3] + inner[1] - outer[1]
    }
  },
  getSelected: function (top0, left0, top1, left1) {
    var result = [Math.min(top0, top1), Math.min(left0, left1), Math.abs(top0 - top1) + 1, Math.abs(left0 - left1) + 1],
      lastResult = []
    while (JSON.stringify(result) != JSON.stringify(lastResult)) {
      lastResult = result.map((a) => a)
      for (var i = result[1]; i < result[1] + result[3]; i++) {
        this.include(result, this.table[result[0]][i])
        this.include(result, this.table[result[0] + result[2] - 1][i])
      }
      for (var i = result[0] + 1; i < result[0] + result[2] - 1; i++) {
        this.include(result, this.table[i][result[1]])
        this.include(result, this.table[i][result[1] + result[3] - 1])
      }
    }
    return { top: result[0], left: result[1], height: result[2], width: result[3] }
  },
  loopArea: function (top, left, height, width, tableState, tableClone, callback) {
    for (var i = 0; i < height; i++) {
      var mcol = 0
      for (var j = 0; j < left + width; j++) {
        if (between(j, left, left + width)) callback(top + i, j, mcol, i == 0 && j == left)
        if (!this.isGoastCell(this.table[top + i][j])) mcol++
      }
      tableState[top + i] = tableClone[i]
    }
  },
}

var S = L.useState({
  table: genArr(16, genArr(8, '')),
  selected: {
    // based on visual pos
    top: 0,
    left: 0,
    height: 1,
    width: 1,
  },
  curColors: {
    bc: '#ffffff',
    fc: '#000000',
  },
})

var vm = L({
  toolbar: {
    open: L.input({
      _type: 'file',
      _accept: '.json5,text/json5',
      onchange: function (e) {
        var fr = new FileReader()
        fr.readAsText(this.files[0])
        fr.onload = function (e) {
          S.table = JSON5.parse(fr.result)
        }
      },
    }),
    newRow: toolButton('新行', function (e) {
      S.table.push(S.table[0].map(() => ''))
    }),
    newColumn: toolButton('新列', function (e) {
      S.table.forEach((row) => row.push(''))
    }),
    newRow2: toolButton('新2行', function (e) {
      S.table.push(S.table[0].map(() => ''))
      S.table.push(S.table[0].map(() => ''))
    }),
    newColumn2: toolButton('新2列', function (e) {
      S.table.forEach((row) => row.push(''))
      S.table.forEach((row) => row.push(''))
    }),
    bgColor: L.input({
      _type: 'color',
      $value: () => S.curColors.bc,
      onchange: function (e) {
        var pos = [S.selected.top, mergeManager.getModelCol(S.selected.top, S.selected.left)]
        var tmp = S.table[pos[0]][pos[1]]
        if (typeof tmp == 'string') tmp = { v: tmp }
        tmp.bc = e.target.value
        S.table[pos[0]][pos[1]] = tmp
      },
    }),
    color: L.input({
      _type: 'color',
      $value: () => S.curColors.fc,
      onchange: function (e) {
        var pos = [S.selected.top, mergeManager.getModelCol(S.selected.top, S.selected.left)]
        var tmp = S.table[pos[0]][pos[1]]
        if (typeof tmp == 'string') tmp = { v: tmp }
        tmp.fc = e.target.value
        S.table[pos[0]][pos[1]] = tmp
      },
    }),
    combine: toolButton('合并', function (e) {
      mergeManager.addMerge(S.selected.top, S.selected.left, S.selected.height, S.selected.width, S.table)
    }),
    split: toolButton('分解', function (e) {
      mergeManager.split(S.selected.top, S.selected.left, S.selected.height, S.selected.width, S.table)
    }),
    save: toolButton('保存', function (e) {
      var link = document.createElement('a')
      link.download = 'table.json5'
      link.type = 'text/json5'
      link.href = URL.createObjectURL(new Blob([JSON5.stringify(S.table)]))
      link.click()
    }),
  },
  mainTable: L.table({
    _style: () => (S.bgColor ? 'background-color:' + S.bgColor : ''),
    $$: () => {
      return S.table.map((row, i) =>
        L.tr({
          $$: row.map((cell, j) =>
            L.td({
              $$: () => (typeof cell == 'object' ? cell.v : cell),
              _contenteditable: 'true',
              _dataPos: () => i + ',' + j,
              _dataVisualPos: () => i + ',' + mergeManager.getVisualCol(i, j),
              _style: () => (cell.bc ? 'background-color:' + cell.bc : '') + (cell.fc ? ';color:' + cell.fc : ''),
              _colspan: () => cell.cs,
              _rowspan: () => cell.rs,
              _class: () => {
                var pos1 = mergeManager.getVisualCol(i, j)
                var inX = between(pos1, S.selected.left, S.selected.width)
                var inY = between(i, S.selected.top, S.selected.height)
                var results = []
                if (inX && inY) results.push('selected')
                if (inX && i == S.selected.top) results.push('selected-top')
                if (inY && pos1 == S.selected.left) results.push('selected-left')
                if (inX && i == S.selected.top + S.selected.height - 1) results.push('selected-bottom')
                if (inY && pos1 == S.selected.left + S.selected.width - 1) results.push('selected-right')
                return results.join(' ')
              },
            })
          ),
        })
      )
    },
    oninput: function (e) {
      var pos = e.target.dataset.pos.split(',')
      L._abortDep = true
      if (typeof S.table[pos[0]][pos[1]] == 'string') S.table[pos[0]][pos[1]] = e.target.textContent
      else S.table[pos[0]][pos[1]].v = e.target.textContent
      L._abortDep = false
    },
    onmousedown: function (e) {
      selecting = true
      selectStart = e.target.dataset.visualPos.split(',').map(Number)
    },
    onmousemove: function (e) {
      if (selecting) {
        var selectEnd = e.target.dataset.visualPos.split(',').map(Number)
        S.selected = mergeManager.getSelected(...selectStart, ...selectEnd)
      }
    },
    onmouseup: function (e) {
      var pos = e.target.dataset.pos.split(',').map(Number),
        curData = S.table[pos[0]][pos[1]]
      S.curColors.bc = curData.bc || '#ffffff'
      S.curColors.fc = curData.fc || '#000000'
      selecting = false
      var selectEnd = e.target.dataset.visualPos.split(',').map(Number)
      S.selected = mergeManager.getSelected(...selectStart, ...selectEnd)
    },
  }),
})
