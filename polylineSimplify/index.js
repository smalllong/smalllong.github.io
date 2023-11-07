var map, route, marker, interval
//基本地图加载
map = new AMap.Map('container', {
  resizeEnable: true,
})
//绘制初始路径
var path = []
path.push([121.24939, 31.068056])
path.push([121.409859, 31.244944])
map.plugin('AMap.DragRoute', function() {
  route = new AMap.DragRoute(map, path, AMap.DrivingPolicy.LEAST_FEE, {
    showTraffic: false,
  }) //构造拖拽导航类
  route.search() //查询导航路径并开启拖拽导航
  interval = setInterval(update, 500)
})
var polyline = new AMap.Polyline({})
var count = document.getElementById('count')
function update() {
  count.innerHTML = route.getRoute().length
}
map.plugin(['AMap.Scale'], function() {
  var scale = new AMap.Scale()
  map.addControl(scale)
})

//由两点得到直线(Ax+By+C=0)
function getLine(pa, pb) {
  return {
    a: pb.lat - pa.lat,
    b: pa.lng - pb.lng,
    c: pb.lng * pa.lat - pa.lng * pb.lat,
  }
}

//计算点P到直线AB的距离(米)
function getPointLineDis(P, A, B) {
  var dPA = P.distance(A),
    dPB = P.distance(B),
    dAB = A.distance(B),
    p = (dPA + dPB + dAB) / 2
  return (Math.sqrt(p * (p - dPA) * (p - dPB) * (p - dAB)) * 2) / dAB
}

//计算点P到线段AB的距离
function getPointSegmentDis(P, A, B) {
  var dPA = P.distance(A),
    dPB = P.distance(B),
    dAB = A.distance(B)
  if (dPA * dPA >= dPB * dPB + dAB * dAB) return dPB
  else if (dPB * dPB >= dPA * dPA + dAB * dAB) return dPA
  else return getPointLineDis(P, A, B)
}

var accuracy = 50,
  markers = []

//递归简化某一段路
function simplifyPolyline(r) {
  var maxIndex,
    max = 0
  var distances = r.map(function(point) {
    return getPointSegmentDis(point, r[0], r[r.length - 1])
  })
  for (var i = 0; i < distances.length; i++) {
    if (distances[i] > max) {
      max = distances[i]
      maxIndex = i
    }
  }
  if (max > accuracy)
    return simplifyPolyline(r.slice(0, maxIndex + 1)).concat(simplifyPolyline(r.slice(maxIndex)).slice(1))
  else return [r[0], r[r.length - 1]]
}

function simplify() {
  clearInterval(interval)
  polyline.setMap()
  var start = Date.now(),
    p = simplifyPolyline(route.getRoute())
  route.destroy()
  console.log(p)
  console.log('用时：' + (Date.now() - start) + 'ms')
  hideMarkers()
  showMarkers(p)
  polyline.setPath(p)
  polyline.setMap(map)
  function setCount() {
    count.innerHTML = p.length
  }
  setTimeout(setCount, 200)
}

function showMarkers(path) {
  path.forEach(function(P) {
    markers.push(
      new AMap.Marker({
        map: map,
        position: P,
      }),
    )
  })
}
function setAccuracy(i) {
  accuracy = i.value
}
function hideMarkers() {
  map.remove(markers)
  markers = []
}

function originRoute() {
  polyline.setMap()
  hideMarkers()
  route = new AMap.DragRoute(map, path, AMap.DrivingPolicy.LEAST_FEE, {
    showTraffic: false,
  }) //构造拖拽导航类
  route.search()
  interval = setInterval(update, 500)
}
