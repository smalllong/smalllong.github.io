var now = new Date(), rootTop = Math.floor(Math.random()*(window.innerHeight - 120))

var vm = new Lightue({
    get _style() {return 'top: '+rootTop+'px'},
    get time() {return now.toLocaleTimeString()},
    get date() {return now.toLocaleDateString()},
})

setInterval(function() {
    now = new Date()
    if (now.getSeconds() == 0)
        rootTop = Math.floor(Math.random()*(window.innerHeight - 120))
    vm.$render()
}, 1000)

window.onresize = function() {
    rootTop = Math.floor(Math.random()*(window.innerHeight - 120))
    vm.$render()
}