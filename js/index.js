// Generated by CoffeeScript 2.7.0
(function() {
  var L, Tile, randomColor;

  L = Lightue;

  randomColor = (initS, initL) => {
    var h, l, s;
    h = Math.floor(Math.random() * 256);
    s = initS + Math.ceil(20 * Math.random());
    l = initL + Math.round(20 * Math.random());
    return 'hsl(' + h + ',' + s + '%,' + l + '%)';
  };

  Tile = (title, link, img) => {
    var color;
    color = randomColor(80, 20);
    return {
      _style: 'background-color: ' + color,
      tileTitle: L.a({
        _href: link,
        $$: title
      }),
      tileImg: img && L.img({
        _src: img
      }),
      onclick: (e) => {
        if (e.target.tagName !== 'A') {
          e.preventDefault();
          return new WinBox(title, {
            url: link,
            width: 640,
            height: 480,
            x: 'center',
            y: 'center',
            border: 6,
            background: color + ' linear-gradient(to bottom, #000, #bbb, #000)'
          });
        }
      }
    };
  };

  L({
    _style: 'background-image: linear-gradient(' + randomColor(20, 10) + ',' + randomColor(20, 10) + ')',
    tiles: [Tile('Simple sheet editor', 'https://smalllong.github.io/json5-sheet-editor/', 'spreadsheet/index.png'), Tile('Skyscrapers Map in Shanghai', 'sh-skyscrapers/index.html', 'sh-skyscrapers/index.png'), Tile('get your browser information', 'browser/index.html', 'browser/index.png'), Tile('a simple digital clock', 'clock/index.html', 'clock/index.png'), Tile('different behavior of 5 center methods', 'center/index.html', 'center/index.png'), Tile('Polyline Simplify on a Gaode Map', 'polylineSimplify/index.html', 'polylineSimplify/index.png'), Tile('Zoomable full screen photo viewer', 'photoViewer/index.html'), Tile('Simple polygon test', 'simplePolygon/index.html'), Tile('A colorful ball fountain with motion blur', 'fountain/index.html'), Tile('A flip style num stepper', 'flipNum/index.html'), Tile('About me', 'about/index.html')]
  });

}).call(this);
