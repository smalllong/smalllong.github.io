function Tile(title, link, img) {
  this.tileFace = {
    tileTitle: title,
  }
  if (img)
    this.tileFace.tileImg = {
      $tag: 'img',
      _src: img,
    }
  this.tileBack = {
    tileLink: {
      $tag: 'a',
      $inner: 'see more',
      _href: link,
    }
  }
}

var vm = Lightue({
  tiles: [
    new Tile('get your browser information', 'browser/index.html', 'browser/index.png'),
    new Tile('different behavior of 4 center methods', 'center/index.html', 'center/index.png'),
    new Tile('Polyline Simplify on a Gaode Map', 'polylineSimplify/index.html', 'polylineSimplify/index.png'),
    new Tile('Zoomable full screen photo viewer', 'photoViewer/index.html'),
    new Tile('Simple polygon test', 'simplePolygon/index.html'),
    new Tile('Chat', 'chat/index.html'),
    new Tile('A colorful ball fountain with motion blur', 'fountain/index.html'),
    new Tile('A editable full calendar', 'editable-full-calendar/index.html'),
    new Tile('a d3js editable tree', 'editable-tree/index.html', 'img/editable-tree.png'),
    new Tile('a d3js fan', 'fan/index.html', 'img/fanLite.png'),
  ]
})
