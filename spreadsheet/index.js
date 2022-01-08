var L = Lightue;

function toolButton(content, onclick) {
  return L.button({
    _type: "button",
    onclick: onclick,
    $$: content,
  });
}

var S = L.useState({
  table: [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ],
});

var vm = L({
  toolbar: {
    newRow: toolButton("新行", function (e) {
      S.table.push(S.table[0].map(() => ""));
      S.table = JSON.parse(JSON.stringify(S.table));
    }),
    newColumn: toolButton("新列", function (e) {
      S.table.forEach((row) => row.push(""));
      S.table = JSON.parse(JSON.stringify(S.table));
    }),
  },
  mainTable: L.table({
    _border: "1",
    $$: () =>
      S.table.map((row, i) =>
        L.tr({
          $$: row.map((cell, j) =>
            L.td({
              $$: cell,
              _contenteditable: "true",
              _dataPos: () => i + "," + j,
            })
          ),
        })
      ),
    oninput: function (e) {
      var pos = e.target.dataset.pos.split(",");
      S.table[pos[0]][pos[1]] = e.target.textContent;
    },
  }),
});
