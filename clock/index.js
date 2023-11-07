var S = Lightue.useState({
  now: new Date(),
  rootTop: Math.floor(Math.random() * (window.innerHeight - 120)),
})
var vm = new Lightue({
  _style: () => 'top: ' + S.rootTop + 'px',
  time: () => S.now.toLocaleTimeString(),
  date: () => S.now.toLocaleDateString(),
})

setInterval(function() {
  S.now = new Date()
  if (S.now.getSeconds() == 0) S.rootTop = Math.floor(Math.random() * (window.innerHeight - 120))
}, 1000)

window.onresize = function() {
  S.rootTop = Math.floor(Math.random() * (window.innerHeight - 120))
}
