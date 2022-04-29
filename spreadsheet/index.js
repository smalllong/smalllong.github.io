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

function getSelected(top0, left0, top1, left1) {
  return {
    top: Math.min(top0, top1),
    left: Math.min(left0, left1),
    height: Math.abs(top0 - top1) + 1,
    width: Math.abs(left0 - left1) + 1,
  }
}

function genArr(length) {
  return 's'
    .repeat(length)
    .split('')
    .map(() => '')
}

var S = L.useState({
  table: [genArr(5), genArr(5), genArr(5), genArr(5), genArr(5)],
  selected: {
    // based on visual pos
    left: 0,
    top: 0,
    width: 1,
    height: 1,
  },
  curColors: {
    bc: '#ffffff',
    fc: '#000000',
  },
})

var combineInserts = [] // combined cells interts virtual cells, based on visual pos
function removeInsert(top, left) {
  for (var i = combineInserts.length - 1; i >= 0; i--) {
    var insert = combineInserts[i]
    if (insert[0] == top && insert[1] == left) {
      combineInserts.splice(i, 1)
    }
  }
}
function getVisualPos(pos0, pos1) {
  // model pos => visual pos
  var tmp = [],
    result = -1
  for (var insert of combineInserts) {
    if (insert[0] == pos0) {
      for (var i = 0; i < insert[2]; i++) {
        tmp[insert[1] + i] = true
      }
    }
  }
  for (; pos1 >= 0; pos1--) {
    result++
    while (tmp[result]) result++
  }
  return result
}
function getPos1(top, left) {
  var td = document.querySelector('.main-table td[data-visual-pos="' + top + ',' + left + '"]')
  if (td) return td.dataset.pos.split(',').map(Number)[1]
  var tmp = [],
    result = 0
  for (var insert of combineInserts) {
    if (insert[0] == top) {
      for (var i = 0; i < insert[2]; i++) {
        tmp[insert[1] + i] = true
      }
    }
  }
  for (var i = 0; i < left; i++) {
    if (!tmp[i]) result++
  }
  return result
}

var vm = L({
  toolbar: {
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
        var pos = [S.selected.top, getPos1(S.selected.top, S.selected.left)]
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
        var pos = [S.selected.top, getPos1(S.selected.top, S.selected.left)]
        var tmp = S.table[pos[0]][pos[1]]
        if (typeof tmp == 'string') tmp = { v: tmp }
        tmp.fc = e.target.value
        S.table[pos[0]][pos[1]] = tmp
      },
    }),
    combine: toolButton('合并', function (e) {
      var pos = [S.selected.top, getPos1(S.selected.top, S.selected.left)]
      var tmp = S.table[pos[0]][pos[1]]
      if (typeof tmp == 'string') tmp = { v: tmp }
      tmp.cs = S.selected.width
      tmp.rs = S.selected.height
      S.table[pos[0]][pos[1]] = tmp
      for (let i = 0; i < S.selected.height; i++) {
        if (i == 0) {
          S.table[pos[0]].splice(pos[1] + 1, S.selected.width - 1)
          if (S.selected.width > 1) combineInserts.push([pos[0], S.selected.left + 1, S.selected.width - 1])
        } else {
          var curRowPos1 = getPos1(pos[0] + i, S.selected.left)
          S.table[pos[0] + i].splice(curRowPos1, S.selected.width)
          combineInserts.push([pos[0] + i, S.selected.left, S.selected.width])
        }
        S.table[pos[0] + i] = JSON.parse(JSON.stringify(S.table[pos[0] + i]))
      }
    }),
    split: toolButton('分解', function (e) {
      var toSplit = document.querySelectorAll('td.selected[rowspan],td.selected[colspan]')
      toSplit.forEach((cell) => {
        var pos = cell.dataset.pos.split(',').map(Number),
          visualPos = cell.dataset.visualPos.split(',').map(Number),
          rowspan = Number(cell.getAttribute('rowspan') || '1'),
          colspan = Number(cell.getAttribute('colspan') || '1')
        S.table[pos[0]][pos[1]].cs = 1
        S.table[pos[0]][pos[1]].rs = 1
        for (var i = 0; i < rowspan; i++) {
          if (i == 0) {
            S.table[pos[0]].splice(pos[1] + 1, 0, ...genArr(colspan - 1))
            removeInsert(pos[0], visualPos[1] + 1)
          } else {
            var curRowPos1 = getPos1(pos[0] + i, visualPos[1] + colspan)
            S.table[pos[0] + i].splice(curRowPos1, 0, ...genArr(colspan))
            removeInsert(pos[0] + i, visualPos[1])
          }
          S.table[pos[0] + i] = JSON.parse(JSON.stringify(S.table[pos[0] + i]))
        }
      })
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
              _dataVisualPos: () => i + ',' + getVisualPos(i, j),
              _style: () => (cell.bc ? 'background-color:' + cell.bc : '') + (cell.fc ? ';color:' + cell.fc : ''),
              _colspan: () => cell.cs,
              _rowspan: () => cell.rs,
              _class: () => {
                var pos1 = getVisualPos(i, j)
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
        S.selected = getSelected(...selectStart, ...selectEnd)
      }
    },
    onmouseup: function (e) {
      var pos = e.target.dataset.pos.split(',').map(Number),
        curData = S.table[pos[0]][pos[1]]
      S.curColors.bc = curData.bc || '#ffffff'
      S.curColors.fc = curData.fc || '#000000'
      selecting = false
      var selectEnd = e.target.dataset.visualPos.split(',').map(Number)
      S.selected = getSelected(...selectStart, ...selectEnd)
    },
  }),
})
