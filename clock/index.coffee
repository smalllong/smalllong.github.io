S = Lightue.useState
  now: new Date()
  rootTop: Math.floor(Math.random() * (window.innerHeight - 120))

Lightue
  _style: () => 'top: ' + S.rootTop + 'px'
  time: () => S.now.toLocaleTimeString()
  date: () => S.now.toLocaleDateString()

window.onresize = () =>
  S.rootTop = Math.floor Math.random() * (window.innerHeight - 120)

setInterval => 
  S.now = new Date()
  if S.now.getSeconds() == 0
    window.onresize()
, 1000
