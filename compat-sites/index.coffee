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
  div.title '本站收录各种兼容性优秀的网站，适合老设备、老浏览器访问'
  div.title '常用'
  Tile 'hao123', 'https://www.hao123.com', 'logos/hao123.png'
  Tile '2345', 'https://www.2345.com', 'logos/2345.svg'
  Tile '优设', 'https://hao.uisdc.com', 'logos/uisdc.png'
  div.title '日常'
  Tile '时间网', 'http://www.shijian.cc', 'logos/shijian.png'
  Tile '中国居民膳食指南', 'http://dg.cnsoc.org'
  Tile '唤醒食物', 'https://www.foodwake.cn'
  div.title '工具'
  Tile '网速测试', 'https://test.ustc.edu.cn', 'logos/cesu.ico'
  Tile '磁搜', 'https://mv8备用网址-icisou点com.cilibaidu.xyz'
  div.title '数码'
  Tile '绿软下载站', 'http://www.itmop.com'
  Tile '极限苹果', 'https://www.applex.net', 'logos/applex.png'
  Tile '柯基捷径库', 'https://www.kejicut.com'
  div.title '游戏'
  Tile 'PC Gaming Wiki', 'https://www.pcgamingwiki.com/wiki/Home'
  Tile 'My Abandonware', 'https://www.myabandonware.com'
  Tile 'Old Games Download', 'https://oldgamesdownload.com'
  Tile '老男人游戏网', 'https://www.oldmantvg.net'
  Tile 'java游戏小站', 'https://java.owoemu.com'
  div.title '影视'
  Tile '80s', 'https://www.80s.so'
  Tile '动漫花园', 'https://www.huayuandm.com'
  div.title '技术'
  Tile '菜鸟教程', 'https://www.runoob.com'
  Tile 'NPM', 'https://www.npmjs.com'
  Tile 'Lightue', 'https://lightue.netlify.app'
  div.title '阅读'
  Tile '看云', 'https://www.kancloud.cn/explore'
