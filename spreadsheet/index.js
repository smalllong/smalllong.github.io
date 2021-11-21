var L = Lightue

function toolButton(content, onclick) {
	return L.button({
		_type: 'button',
		onclick: onclick,
		$$: content
	})
}

var columnCount = 3, rowCount = 3;
var table = [];
for (var i=0; i<rowCount; i++) {
	var row = L.tr([]);
	for (var j=0; j<columnCount; j++) {
		row.push(L.td());
	}
	table.push(row)
}

var vm = L({
	toolbar: {
		newRow: toolButton('新行', function(e) {
			rowCount ++;
			var newRow = L.tr([]);
			for (var i=0; i<columnCount; i++) {
				newRow.push(L.td());
			}
			vm.mainTable.$$.push(newRow);
		}),
		newColumn: toolButton('新列', function(e) {
			columnCount ++;
			vm.mainTable.$$.forEach(function(row, i) {
				row.push(L.td())
			})
		})
	},
	mainTable: L.table({
		_border: '1',
		_contenteditable: 'true',
		$$: table,
		onclick: function(e) {
			console.log(e.target)
		}
	})
})
