function randomColor() {
  var h = Math.floor(Math.random()*256),
    s = 80+Math.ceil(20*Math.random()),
    l = 25+Math.round(20*Math.random())
  return 'hsl('+h+','+s+'%,'+l+'%)'
}

function Tile(title, link, img) {
  return {
    $tag: 'a',
    _href: link,
    _style: 'background-color: '+randomColor(),
    tileTitle: title,
    tileImg: img?{
      $tag: 'img',
      _src: img,
    }:undefined,
  }
}

var vm = Lightue({
  tiles: [
    Tile('Skyscrapers Map in Shanghai', 'sh-skyscrapers/index.html'),
    Tile('get your browser information', 'browser/index.html', 'browser/index.png'),
    Tile('a simple digital clock', 'clock/index.html', 'clock/index.png'),
    Tile('different behavior of 4 center methods', 'center/index.html', 'center/index.png'),
    Tile('Polyline Simplify on a Gaode Map', 'polylineSimplify/index.html', 'polylineSimplify/index.png'),
    Tile('Zoomable full screen photo viewer', 'photoViewer/index.html'),
    Tile('Simple polygon test', 'simplePolygon/index.html'),
    Tile('Chat', 'chat/index.html'),
    Tile('Compute simple ratio', 'ratio/index.html'),
    Tile('A colorful ball fountain with motion blur', 'fountain/index.html'),
    Tile('A editable full calendar', 'editable-full-calendar/index.html'),
    Tile('a d3js editable tree', 'editable-tree/index.html', 'img/editable-tree.png'),
    Tile('a d3js fan', 'fan/index.html', 'img/fanLite.png'),
  ]
})
