var S = Lightue.useState({
    now: new Date(),
    rootTop: Math.floor(Math.random()*(window.innerHeight - 120)),
})
var vm = new Lightue({
    get _style() {return 'top: '+S.rootTop+'px'},
    get time() {return S.now.toLocaleTimeString()},
    get date() {return S.now.toLocaleDateString()},
})

setInterval(function() {
    S.now = new Date()
    if (S.now.getSeconds() == 0)
        S.rootTop = Math.floor(Math.random()*(window.innerHeight - 120))
}, 1000)

window.onresize = function() {
    S.rootTop = Math.floor(Math.random()*(window.innerHeight - 120))
}