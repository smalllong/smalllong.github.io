randomColor = (initS, initL) =>
  h = Math.floor Math.random() * 256
  s = initS + Math.ceil 20 * Math.random()
  l = initL + Math.round 20 * Math.random()
  'hsl(' + h + ',' + s + '%,' + l + '%)'

Tile = (title, link, image) =>
  color = randomColor 80, 20

  a.tile
    href: link
    style: 'background-color: ' + color
    div.tileTitle title
    image && img.tileImg src: image

L div.tiles style: 'background-image: linear-gradient(' + randomColor(20, 10) + ',' + randomColor(20, 10) + ')',
  Tile '极限苹果', 'https://www.applex.net', 'logos/applex.png'
  Tile '搜狗', 'https://sogou.com', 'logos/sogou.png'
  Tile 'hao123', 'https://www.hao123.com', 'logos/hao123.png'
  Tile '网速测试', 'https://test.ustc.edu.cn', 'logos/cesu.ico'
  Tile '简书', 'https://www.jianshu.com'
  Tile '看云', 'https://www.kancloud.cn/explore'
  Tile 'PC Gaming Wiki', 'https://www.pcgamingwiki.com/wiki/Home'
  Tile 'My Abandonware', 'https://www.myabandonware.com'
  Tile 'Old Games Download', 'https://oldgamesdownload.com'
  Tile '磁搜', 'https://mv8备用网址-icisou点com.cilibaidu.xyz'
  Tile '绿软下载站', 'http://www.itmop.com'
  Tile '动漫花园', 'https://www.huayuandm.com'
