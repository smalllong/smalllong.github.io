function randomColor(initS, initL) {
  var h = Math.floor(Math.random()*256),
    s = initS+Math.ceil(20*Math.random()),
    l = initL+Math.round(20*Math.random())
  return 'hsl('+h+','+s+'%,'+l+'%)'
}

function Tile(title, link, img) {
  return {
    $tag: 'a',
    _href: link,
    _style: 'background-color: '+randomColor(80, 25),
    tileTitle: title,
    tileImg: img?{
      $tag: 'img',
      _src: img,
    }:undefined,
  }
}

var vm = Lightue({
  _style: 'background-image: linear-gradient('+randomColor(20, 10)+','+randomColor(20, 10)+')',
  tiles: [
    Tile('Skyscrapers Map in Shanghai', 'sh-skyscrapers/index.html'),
    Tile('get your browser information', 'browser/index.html', 'browser/index.png'),
    Tile('a simple digital clock', 'clock/index.html', 'clock/index.png'),
    Tile('different behavior of 4 center methods', 'center/index.html', 'center/index.png'),
    Tile('Polyline Simplify on a Gaode Map', 'polylineSimplify/index.html', 'polylineSimplify/index.png'),
    Tile('Zoomable full screen photo viewer', 'photoViewer/index.html'),
    Tile('Simple polygon test', 'simplePolygon/index.html'),
    Tile('Chat', 'chat/index.html'),
    Tile('Simple sheet editor', 'spreadsheet/index.html'),
    Tile('A colorful ball fountain with motion blur', 'fountain/index.html'),
  ]
})
